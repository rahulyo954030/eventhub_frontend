'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Html5Qrcode } from 'html5-qrcode';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { checkinService } from '@/services';
import { getErrorMessage } from '@/utils/helpers';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];

export default function ScannerPage() {
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [imageScanning, setImageScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const imagePreviewRef = useRef(null);

  const handleDecodedQr = async (decodedText) => {
    const value = (decodedText || '').trim();
    if (!value) return;

    try {
      const response = await checkinService.checkIn(value);
      setResult(response.data.data);
      if (response.data.data.status === 'success') {
        toast.success('Checked in');
      } else {
        toast('Already checked in');
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const scanQrFromFile = async (file) => {
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Please choose a JPG, PNG, or WebP image');
      return;
    }

    setImageScanning(true);
    setResult(null);

    if (imagePreviewRef.current) {
      URL.revokeObjectURL(imagePreviewRef.current);
    }
    const previewUrl = URL.createObjectURL(file);
    imagePreviewRef.current = previewUrl;
    setImagePreview(previewUrl);

    const fileScanner = new Html5Qrcode('qr-file-reader');

    try {
      const decodedText = await fileScanner.scanFile(file, false);
      await handleDecodedQr(decodedText);
    } catch {
      toast.error('No QR code found in this image. Try a clearer photo.');
    } finally {
      try {
        fileScanner.clear();
      } catch {}
      setImageScanning(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    await scanQrFromFile(file);
  };

  const clearImagePreview = () => {
    if (imagePreviewRef.current) {
      URL.revokeObjectURL(imagePreviewRef.current);
      imagePreviewRef.current = null;
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startScanner = async () => {
    if (scannerRef.current || scanning) return;
    setScanning(true);
    const html5QrCode = new Html5Qrcode('qr-reader');
    scannerRef.current = html5QrCode;

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras || cameras.length === 0) {
        throw new Error('No camera detected');
      }

      const preferredCamera =
        cameras.find((cam) => cam.label?.toLowerCase().includes('back')) ||
        cameras.find((cam) => cam.label?.toLowerCase().includes('rear')) ||
        cameras[0];

      const qrSize = Math.min(280, Math.max(200, (typeof window !== 'undefined' ? window.innerWidth : 360) - 48));

      await html5QrCode.start(
        preferredCamera.id,
        {
          fps: 12,
          qrbox: { width: qrSize, height: qrSize },
          aspectRatio: 1.0,
          disableFlip: false,
        },
        async (decodedText) => handleDecodedQr(decodedText),
        () => {}
      );
    } catch (error) {
      toast.error(error?.message || 'Camera access failed. Check permissions.');
      if (scannerRef.current) {
        try {
          await scannerRef.current.clear();
        } catch {}
        scannerRef.current = null;
      }
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanner();
      if (imagePreviewRef.current) {
        URL.revokeObjectURL(imagePreviewRef.current);
      }
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="page-form-wrap-narrow">
        <div className="mb-6">
          <h1 className="page-title">Check-in scanner</h1>
          <p className="page-subtitle">Point the camera at a guest&apos;s QR code.</p>
        </div>

        <div className="card">
          <div id="qr-reader" className="overflow-hidden rounded-md border border-stone-200" />
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-3">
            <button type="button" onClick={startScanner} className="btn-primary w-full sm:w-auto" disabled={scanning}>
              {scanning ? 'Scanning…' : 'Start camera'}
            </button>
            <button type="button" onClick={stopScanner} className="btn-secondary w-full sm:w-auto" disabled={!scanning}>
              Stop
            </button>
          </div>

          <div className="mt-8 border-t border-stone-100 pt-6">
            <p className="text-sm font-medium text-stone-800">Upload QR image</p>
            <p className="mt-1 text-xs text-stone-500">
              Browse from your computer or phone gallery — we&apos;ll scan and check in automatically.
            </p>

            <div id="qr-file-reader" className="hidden" aria-hidden="true" />

            <label
              className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition ${
                imageScanning
                  ? 'border-primary-300 bg-primary-50/50'
                  : 'border-stone-200 bg-stone-50/50 hover:border-primary-400 hover:bg-primary-50/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={imageScanning}
                onChange={handleImageSelect}
              />
              {imageScanning ? (
                <p className="text-sm font-medium text-primary-700">Scanning image…</p>
              ) : (
                <>
                  <svg className="mb-2 h-8 w-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-semibold text-stone-700">Choose QR image</p>
                  <p className="mt-1 text-xs text-stone-500">JPG, PNG, WebP — from gallery or files</p>
                </>
              )}
            </label>

            {imagePreview && (
              <div className="mt-4 overflow-hidden rounded-lg border border-stone-200 bg-white">
                <img src={imagePreview} alt="Uploaded QR preview" className="max-h-48 w-full object-contain bg-stone-50" />
                <div className="flex items-center justify-between border-t border-stone-100 px-3 py-2">
                  <p className="text-xs text-stone-500">Uploaded image</p>
                  <button type="button" onClick={clearImagePreview} className="text-xs font-medium text-stone-600 hover:text-stone-900">
                    Remove
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {result && (
          <div className={`card mt-6 ${result.status === 'success' ? 'border-primary-200' : ''}`}>
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Result</p>
            <p className="mt-2 font-display text-xl text-stone-900">{result.message}</p>
            {result.attendee && (
              <dl className="mt-4 space-y-2 border-t border-stone-100 pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Name</dt>
                  <dd className="text-stone-800">{result.attendee.fullName}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-500">Email</dt>
                  <dd className="text-stone-800">{result.attendee.email}</dd>
                </div>
                {result.attendee.company && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-stone-500">Company</dt>
                    <dd className="text-stone-800">{result.attendee.company}</dd>
                  </div>
                )}
              </dl>
            )}
            {result.event && (
              <p className="mt-4 text-sm text-stone-600">
                Event: <span className="text-stone-800">{result.event.name}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
