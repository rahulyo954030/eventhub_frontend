'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ChartCard from '@/components/ui/ChartCard';
import StatCard from '@/components/ui/StatCard';
import { dashboardService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import { formatDate, formatDateTime, getErrorMessage } from '@/utils/helpers';
import {
  COLORS,
  lineChartOptions,
  barChartOptions,
  buildLineDataset,
  buildBarDatasets,
} from '@/utils/chartConfig';
import toast from 'react-hot-toast';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading || !isAuthenticated) return undefined;

    const fetchData = async () => {
      try {
        const response = await dashboardService.getData();
        setData(response.data.data);
      } catch (error) {
        if (error?.response?.status !== 401) {
          toast.error(getErrorMessage(error));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    return undefined;
  }, [authLoading, isAuthenticated]);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const cards = data?.cards || {};
  const charts = data?.charts || {};

  const regTrend = charts.registrationTrend || [];
  const attTrend = charts.attendanceTrend || [];
  const eventStats = charts.eventStatistics || [];

  const registrationChartData = {
    labels: regTrend.map((d) => d.date),
    datasets: [
      buildLineDataset({
        label: 'Registrations',
        data: regTrend.map((d) => d.count),
        color: COLORS.teal,
      }),
    ],
  };

  const attendanceChartData = {
    labels: attTrend.map((d) => d.date),
    datasets: [
      buildLineDataset({
        label: 'Check-ins',
        data: attTrend.map((d) => d.count),
        color: COLORS.stone,
      }),
    ],
  };

  const eventStatsData = {
    labels: eventStats.map((e) => e.eventName),
    datasets: buildBarDatasets([
      { label: 'Registered', data: eventStats.map((e) => e.registered), color: COLORS.tealMid },
      { label: 'Checked in', data: eventStats.map((e) => e.checkedIn), color: COLORS.stoneMid },
    ]),
  };

  const regTotal = regTrend.reduce((s, d) => s + d.count, 0);
  const attTotal = attTrend.reduce((s, d) => s + d.count, 0);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-title">Overview</h1>
        <p className="mt-1 text-sm text-stone-600">Invites, registrations, and check-ins across your events.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Events" value={cards.totalEvents} accent="muted" />
        <StatCard label="Invited" value={cards.totalInvitations} accent="stone" />
        <StatCard label="Registered" value={cards.totalRegistrations} accent="teal" />
        <StatCard label="Checked in" value={cards.totalCheckIns} accent="teal" />
        <StatCard
          label="Show-up rate"
          value={`${cards.attendancePercentage || 0}%`}
          accent="teal"
          hint="Of confirmed guests"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Registrations"
          subtitle={`Last 30 days · ${regTotal} total`}
          empty={regTrend.length === 0}
        >
          <Line data={registrationChartData} options={lineChartOptions} />
        </ChartCard>
        <ChartCard
          title="Check-ins"
          subtitle={`Last 30 days · ${attTotal} total`}
          empty={attTrend.length === 0}
        >
          <Line data={attendanceChartData} options={lineChartOptions} />
        </ChartCard>
      </div>

      <div className="mt-4">
        <ChartCard
          title="Attendance by event"
          subtitle="Registered vs checked in"
          empty={eventStats.length === 0}
          emptyMessage="Create an event and register guests to see comparisons."
          height={Math.max(200, eventStats.length * 48)}
        >
          <Bar data={eventStatsData} options={barChartOptions} />
        </ChartCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-sm font-medium text-stone-900">Recent activity</h3>
          <div className="space-y-0 divide-y divide-stone-100">
            {(data?.recentActivities || []).length === 0 ? (
              <p className="text-sm text-stone-500">Nothing recent yet.</p>
            ) : (
              data.recentActivities.map((activity, i) => (
                <div key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" />
                  <div>
                    <p className="text-sm text-stone-700">{activity.message}</p>
                    <p className="mt-0.5 text-xs text-stone-400">{formatDateTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-sm font-medium text-stone-900">Coming up</h3>
          <div className="space-y-0 divide-y divide-stone-100">
            {(data?.upcomingEvents || []).length === 0 ? (
              <p className="text-sm text-stone-500">No upcoming events.</p>
            ) : (
              data.upcomingEvents.map((event) => (
                <div key={event._id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div>
                    <Link href={`/events/${event._id}`} className="text-sm font-medium text-stone-900 hover:text-primary-700">
                      {event.name}
                    </Link>
                    <p className="text-xs text-stone-500">{event.venue}</p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-stone-500">
                    <p>{formatDate(event.eventDate)}</p>
                    <p>{event.eventTime}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
