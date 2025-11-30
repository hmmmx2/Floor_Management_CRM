import Image from "next/image";
import Link from "next/link";

import logo from "@/app/images/logo.png";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2.04C6.5 2.04 2 6.53 2 12.04c0 5.07 3.69 9.29 8.5 9.96v-7.05H7.5V12.04h3V9.5c0-2.97 1.81-4.6 4.45-4.6 1.31 0 2.44.23 2.77.33v3.05h-1.8c-1.41 0-1.68.67-1.68 1.65v2.14h3.39l-.55 3.41h-2.84v7.05c4.81-.67 8.5-4.89 8.5-9.96 0-5.51-4.5-10-9.96-10z" />
    </svg>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M22.46 5.94c-.66.29-1.37.48-2.1.57.76-.46 1.34-1.18 1.62-2.04-.71.42-1.5.73-2.34.9-.67-.71-1.62-1.15-2.68-1.15-2.03 0-3.68 1.65-3.68 3.68 0 .29.03.57.08.84-3.06-.15-5.77-1.62-7.59-3.84-.32.55-.5 1.19-.5 1.88 0 1.28.65 2.41 1.64 3.07-.6-.02-1.16-.18-1.65-.45v.05c0 1.78 1.27 3.27 2.95 3.61-.31.08-.64.12-.98.12-.24 0-.47-.02-.7-.07.47 1.46 1.83 2.53 3.45 2.56-1.26.99-2.85 1.58-4.58 1.58-.3 0-.59-.02-.88-.05 1.63 1.05 3.57 1.66 5.66 1.66 6.79 0 10.5-5.62 10.5-10.5 0-.16-.01-.32-.01-.48.72-.52 1.34-1.17 1.83-1.91z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.27.06 2.05.27 2.67.51.62.25 1.13.6 1.64 1.11.51.51.86 1.02 1.11 1.64.24.62.45 1.4.51 2.67.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.06 1.27-.27 2.05-.51 2.67-.25.62-.6 1.13-1.11 1.64-.51.51-1.02.86-1.64 1.11-.62.24-1.4.45-2.67.51-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.27-.06-2.05-.27-2.67-.51-.62-.25-1.13-.6-1.64-1.11-.51-.51-.86-1.02-1.11-1.64-.24-.62-.45-1.4-.51-2.67-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.06-1.27.27-2.05.51-2.67.25-.62.6-1.13 1.11-1.64.51-.51 1.02-.86 1.64-1.11.62-.24 1.4-.45 2.67-.51 1.27-.06 1.65-.07 4.85-.07zm0-2.16c-3.26 0-3.68.01-4.95.07-1.3.06-2.2.28-2.98.58-.78.3-1.4.72-2.06 1.38-.66.66-1.08 1.28-1.38 2.06-.3.78-.52 1.68-.58 2.98-.06 1.27-.07 1.69-.07 4.95s.01 3.68.07 4.95c.06 1.3.28 2.2.58 2.98.3.78.72 1.4 1.38 2.06.66.66 1.28 1.08 2.06 1.38.78.3 1.68.52 2.98.58 1.27.06 1.69.07 4.95.07s3.68-.01 4.95-.07c1.3-.06 2.2-.28 2.98-.58.78-.3 1.4-.72 2.06-1.38.66-.66 1.08-1.28 1.38-2.06.3-.78.52-1.68.58-2.98.06-1.27.07-1.69.07-4.95s-.01-3.68-.07-4.95c-.06-1.3-.28-2.2-.58-2.98-.3-.78-.72-1.4-1.38-2.06-.66-.66-1.28-1.08-2.06-1.38-.78-.3-1.68-.52-2.98-.58-1.27-.06-1.69-.07-4.95-.07zM12 15.8c-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8 3.8 1.7 3.8 3.8-1.7 3.8-3.8 3.8zm0-6.4c-1.43 0-2.6 1.17-2.6 2.6s1.17 2.6 2.6 2.6 2.6-1.17 2.6-2.6-1.17-2.6-2.6-2.6zm6.4-3.8c-.54 0-.98.44-.98.98s.44.98.98.98.98-.44.98-.98-.44-.98-.98-.98z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-primary-red text-pure-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src={logo}
                alt="Flood Management logo"
                width={40}
                height={40}
                priority
                className="filter brightness-0 invert"
              />
              <div>
                <p className="text-lg font-semibold leading-tight">
                  Flood Management
                </p>
                <p className="text-xs uppercase tracking-wide opacity-80">
                  IoT Command Center
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm opacity-90">
              Dedicated to providing real-time flood monitoring and alert
              systems to protect communities in Malaysia.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-pure-white/80 transition hover:text-pure-white"
              >
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-pure-white/80 transition hover:text-pure-white"
              >
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-pure-white/80 transition hover:text-pure-white"
              >
                <InstagramIcon className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h3 className="text-base font-semibold">Main</h3>
            <ul className="mt-4 space-y-2 text-sm opacity-90">
              <li>
                <Link href="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/sensors" className="hover:underline">
                  Sensors
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:underline">
                  Flood Map
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-base font-semibold">Insights</h3>
            <ul className="mt-4 space-y-2 text-sm opacity-90">
              <li>
                <Link href="/analytics" className="hover:underline">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="hover:underline">
                  Alerts
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-base font-semibold">Management</h3>
            <ul className="mt-4 space-y-2 text-sm opacity-90">
              <li>
                <Link href="/roles" className="hover:underline">
                  Role Management
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:underline">
                  Admin Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-pure-white/10 px-6 py-4 text-sm font-medium md:justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <span>+60 3-2333 2333</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <span>info@floodmanagement.my</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-pure-white/20 pt-8 text-center">
          <p className="text-sm opacity-90">
            © 2025 Malaysian Red Crescent. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

