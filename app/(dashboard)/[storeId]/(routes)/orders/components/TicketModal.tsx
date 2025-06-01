"use client";
import { Printer } from "lucide-react";
import Image from "next/image";
import React from "react";

interface TicketModalProps {
  order: {
    id: string;
    phone: string;
    address: string;
    products: string;
    totalPrice: string;
    isPaid: boolean;
    createdAt: string;
    customerName?: string;
    shippingMethod?: string;
    trackingNumber?: string;
  };
  storeLogoUrl?: string;
  onClose: () => void;
}

export const TicketModal: React.FC<
  TicketModalProps & { width?: string | number }
> = ({ order, storeLogoUrl = "/logo.png", onClose, width = "440px" }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 print:bg-transparent">
    <div
      className="bg-white rounded-lg shadow-xl print:w-full print:shadow-none overflow-hidden border border-gray-200"
      style={{ width }}
    >
      {/* --- Header (Depop-style) --- */}
      <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Image
            src={storeLogoUrl}
            alt="Store Logo"
            width={36}
            height={36}
            className="rounded-full border border-gray-200"
          />
          <div>
            <h3 className="text-lg text-black font-semibold tracking-tight">
              Max’s Store
            </h3>
            <p className="text-xs text-gray-500 tracking-wider">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-600 font-mono">{order.createdAt}</p>
      </div>

      {/* --- Body Content --- */}
      <div className="px-6 py-5 text-gray-800 font-sans">
        {/* Ship To / From */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Ship To
            </p>
            <p className="mt-1 text-sm font-medium">
              {order.customerName || "Customer"}
            </p>
            <p className="text-sm">{order.address}</p>
            <p className="text-sm">{order.phone}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              From
            </p>
            <p className="mt-1 text-sm font-medium">Max’s Store Warehouse</p>
            <p className="text-sm">1234 Market St.</p>
            <p className="text-sm">Brooklyn, NY 11201</p>
            <p className="text-sm">USA</p>
          </div>
        </div>

        {/* Products / Pricing */}
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Item(s)
          </p>
          <div className="border border-gray-100 rounded-md divide-y divide-gray-100">
            <div className="flex justify-between items-center px-3 py-2">
              <p className="text-sm">{order.products}</p>
              <p className="text-sm font-semibold">{order.totalPrice}</p>
            </div>
          </div>
        </div>

        {/* Payment & Shipping Method */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Payment Status
            </p>
            <p
              className={`mt-1 text-sm font-medium ${
                order.isPaid ? "text-green-600" : "text-red-600"
              }`}
            >
              {order.isPaid ? "Paid" : "Pending"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Shipping
            </p>
            <p className="mt-1 text-sm font-medium">
              {order.shippingMethod || "USPS Priority"}
            </p>
            {order.trackingNumber && (
              <p className="text-xs text-gray-500 tracking-wider mt-0.5">
                Tracking:{" "}
                <span className="font-mono text-sm">
                  {order.trackingNumber}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* --- Modal Footer (Hidden in Print) --- */}
      <div className="flex justify-end items-center px-6 py-3 bg-white border-t border-gray-100 print:hidden">
        <button
          onClick={onClose}
          className="text-gray-600 hover:underline text-sm mr-4"
        >
          Close
        </button>
        <button
          onClick={() => window.print()}
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Printer size={16} />
          Print
        </button>
      </div>
    </div>
  </div>
);
