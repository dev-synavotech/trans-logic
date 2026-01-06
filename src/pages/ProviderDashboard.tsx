import { 
  Truck, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  BarChart3
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import providerHero from "@/assets/provider-hero.png";

const myFleet = [
  { id: "TRK-001", type: "Container", status: "active", driver: "Ramesh K.", route: "Mumbai → Delhi", earnings: "₹12,500" },
  { id: "TRK-002", type: "HCV", status: "active", driver: "Suresh P.", route: "Bangalore → Chennai", earnings: "₹8,200" },
  { id: "TRK-003", type: "Reefer", status: "maintenance", driver: "Unassigned", route: "-", earnings: "₹0" },
  { id: "TRK-004", type: "LCV", status: "idle", driver: "Vijay M.", route: "-", earnings: "₹0" },
  { id: "TRK-005", type: "HCV", status: "active", driver: "Anil S.", route: "Pune → Ahmedabad", earnings: "₹9,800" },
];

const pendingBookings = [
  { id: "BK-2024301", route: "Kolkata → Hyderabad", truck: "HCV", price: "₹78,000", deadline: "In 2 hours" },
  { id: "BK-2024305", route: "Jaipur → Lucknow", truck: "Container", price: "₹55,000", deadline: "In 4 hours" },
  { id: "BK-2024308", route: "Chennai → Kochi", truck: "Reefer", price: "₹42,000", deadline: "Tomorrow" },
];

const recentPayouts = [
  { id: "PAY-001", amount: "₹1,25,000", date: "Jan 1, 2026", status: "completed" },
  { id: "PAY-002", amount: "₹98,500", date: "Dec 25, 2025", status: "completed" },
  { id: "PAY-003", amount: "₹1,15,000", date: "Dec 18, 2025", status: "completed" },
];

const ProviderDashboard = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<any | null>(null);
  const [expandedTruckId, setExpandedTruckId] = useState<number | null>(null);
  const [truckRoutesMap, setTruckRoutesMap] = useState<Record<number, any[]>>({});
  const [loadingRoutesFor, setLoadingRoutesFor] = useState<number | null>(null);
  const [openRouteMap, setOpenRouteMap] = useState<Record<number, boolean>>({});
  const [trucks, setTrucks] = useState<Array<any>>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loadingTrucks, setLoadingTrucks] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  const fetchTrucks = async () => {
    setLoadingTrucks(true);
    try {
      const qs = new URLSearchParams();
      if (filterType) qs.set('type', filterType);
      if (filterCapacity) qs.set('min_capacity', String(filterCapacity));
      if (filterLocation) qs.set('location', filterLocation);
      qs.set('page', String(page));
      qs.set('limit', String(limit));

      const res = await fetch(`http://localhost:8000/providers/trucks?${qs.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch trucks');
      const body = await res.json();
      setTrucks(body.data || []);
      setTotal(body.total || 0);
    } catch (err) {
      console.error('fetchTrucks error', err);
    } finally {
      setLoadingTrucks(false);
    }
  };

  const fetchRoutesForTruck = async (truckId: number) => {
    setLoadingRoutesFor(truckId);
    try {
      const res = await fetch(`http://localhost:8000/providers/trucks/${truckId}/routes`);
      if (!res.ok) throw new Error('Failed to fetch routes');
      const body = await res.json();
      setTruckRoutesMap((m) => ({ ...m, [truckId]: body.data || [] }));
    } catch (err) {
      console.error('fetchRoutesForTruck', err);
      setTruckRoutesMap((m) => ({ ...m, [truckId]: [] }));
    } finally {
      setLoadingRoutesFor(null);
    }
  };

  const toggleTruckRoutes = (truckId: number) => {
    if (expandedTruckId === truckId) {
      // collapse
      setExpandedTruckId(null);
      return;
    }

    // expand new
    setExpandedTruckId(truckId);
    // fetch if not cached
    if (!truckRoutesMap[truckId]) fetchRoutesForTruck(truckId);
  };

  const toggleRoutePlaces = (routeId: number) => {
    setOpenRouteMap((m) => ({ ...m, [routeId]: !m[routeId] }));
  };

  useEffect(() => {
    fetchTrucks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filterType, filterCapacity, filterLocation]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-rose-500 to-pink-600">
          <img 
            src={providerHero} 
            alt="Provider Dashboard" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
          />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Fleet Provider Dashboard</h1>
                <p className="text-white/80">Manage your fleet, accept bookings, and track earnings</p>
              </div>
              <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-fit">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Truck
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Truck</DialogTitle>
                    <DialogDescription>Provide truck details to add to your fleet.</DialogDescription>
                  </DialogHeader>

                  <AddTruckForm
                    initialData={editingTruck || undefined}
                    onSaved={() => {
                      setIsAddOpen(false);
                      setEditingTruck(null);
                      setPage(1);
                      fetchTrucks();
                    }}
                  />

                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Fleet List - Filters */}
        <div className="rounded-lg bg-card border border-border p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Input placeholder="Search location" value={filterLocation} onChange={(e) => { setFilterLocation(e.target.value); setPage(1); }} className="w-full sm:w-64" />
              <Input placeholder="Min capacity (tons)" value={filterCapacity} onChange={(e) => { setFilterCapacity(e.target.value); setPage(1); }} className="w-36" />
              <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }} className="h-10 rounded-md border border-border px-3 bg-transparent">
                <option value="">All types</option>
                <option value="HCV">HCV</option>
                <option value="LCV">LCV</option>
                <option value="Container">Container</option>
                <option value="Reefer">Reefer</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Showing {trucks.length} of {total}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm text-muted-foreground">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Capacity (tons)</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingTrucks ? (
                  <tr><td colSpan={5} className="p-6 text-center">Loading…</td></tr>
                ) : trucks.length === 0 ? (
                  <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No trucks found.</td></tr>
                ) : (
                  trucks.map((t: any) => ([
                    <tr key={`truck-${t.id}`} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">
                        <button className="text-left w-full text-primary underline hover:no-underline" onClick={() => toggleTruckRoutes(t.id)}>
                          {t.truck_name}
                        </button>
                      </td>
                      <td className="px-4 py-3">{t.truck_type}</td>
                      <td className="px-4 py-3">{t.capacity_tons ?? '-'}</td>
                      <td className="px-4 py-3">{t.availability_status}</td>
                      <td className="px-4 py-3">{t.location || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => { setEditingTruck(t); setIsAddOpen(true); }}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={async () => {
                            if (!confirm('Delete this truck?')) return;
                            try {
                              const res = await fetch(`http://localhost:8000/providers/trucks/${t.id}`, { method: 'DELETE' });
                              if (!res.ok) throw new Error('Delete failed');
                              fetchTrucks();
                            } catch (err) {
                              console.error(err);
                              alert('Delete failed');
                            }
                          }}>Delete</Button>
                        </div>
                      </td>
                    </tr>,
                    expandedTruckId === t.id ? (
                      <tr key={`routes-${t.id}`} className="bg-muted/10">
                        <td colSpan={6} className="px-4 py-3">
                          {loadingRoutesFor === t.id ? (
                            <div className="text-sm text-muted-foreground">Loading routes…</div>
                          ) : (
                            <div>
                              {(truckRoutesMap[t.id] || []).length === 0 ? (
                                <div className="text-sm text-muted-foreground">No routes assigned for this truck.</div>
                              ) : (
                                <div className="space-y-4">
                                  {(truckRoutesMap[t.id] || []).map((r:any) => (
                                    <div key={r.id} className="text-sm">
                                      <div className="font-medium mb-1">{r.name || `Route #${r.id}`}</div>
                                      {(r.places || []).length === 0 ? (
                                        <div className="text-sm text-muted-foreground">No places</div>
                                      ) : (
                                        <ol className="mt-1 ml-4 list-decimal text-sm">
                                          {(r.places || []).map((pl:any) => <li key={pl.id}>{pl.address}</li>)}
                                        </ol>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : null
                  ]))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
              <span className="text-sm">Page {page} / {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</Button>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mr-2">Per page</label>
              <select value={String(limit)} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="h-8 rounded-md border border-border px-2">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const AddTruckForm = ({ onSaved, initialData }: { onSaved?: () => void; initialData?: any }) => {
  const [truckType, setTruckType] = useState("");
  const [truckName, setTruckName] = useState("");
  const [truckNumber, setTruckNumber] = useState("");
  const [actualLength, setActualLength] = useState<string>("");
  const [actualWidth, setActualWidth] = useState<string>("");
  const [actualHeight, setActualHeight] = useState<string>("");
  const [availableLength, setAvailableLength] = useState<string>("");
  const [availableWidth, setAvailableWidth] = useState<string>("");
  const [availableHeight, setAvailableHeight] = useState<string>("");
  const [capacityTons, setCapacityTons] = useState<string>("");
  const [availabilityStatus, setAvailabilityStatus] = useState("Available");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message?: string }>({ type: "idle" });
  const statusTimeout = useRef<number | null>(null);

  const numericFields = [
    "actual_length",
    "actual_width",
    "actual_height",
    "available_length",
    "available_width",
    "available_height",
    "capacity_tons",
  ];

  const requiredFields = ["truck_type", "truck_name", "truck_number"];

  const validateField = (name: string, value: any) => {
    if (requiredFields.includes(name)) {
      if (!value || String(value).trim() === "") return "This field is required.";
    }

    if (numericFields.includes(name)) {
      if (value !== null && value !== undefined && value !== "") {
        const n = Number(value);
        if (Number.isNaN(n)) return "Enter a valid number.";
      }
    }

    return "";
  };

  const runValidation = (fields?: Record<string, any>) => {
    const toCheck: Record<string, any> = fields || {
      truck_type: truckType,
      truck_name: truckName,
      truck_number: truckNumber,
      actual_length: actualLength,
      actual_width: actualWidth,
      actual_height: actualHeight,
      available_length: availableLength,
      available_width: availableWidth,
      available_height: availableHeight,
      capacity_tons: capacityTons,
      availability_status: availabilityStatus,
      origin,
      destination,
      notes,
    };

    const newErrors: Record<string, string> = {};
    for (const [k, v] of Object.entries(toCheck)) {
      const err = validateField(k, v);
      if (err) newErrors[k] = err;
    }
    setErrors(newErrors);
    return newErrors;
  };

  const markTouched = (name: string) => setTouched((t) => ({ ...t, [name]: true }));

  const showStatus = (type: "success" | "error", message?: string) => {
    setStatus({ type, message });
    if (statusTimeout.current) window.clearTimeout(statusTimeout.current);
    statusTimeout.current = window.setTimeout(() => setStatus({ type: "idle" }), 4000);
  };

  const inputClass = (fieldName: string) => {
    const base = "w-full rounded-xl px-4 py-3 border bg-muted/50 focus:outline-none focus:ring-2 transition";
    const hasError = !!errors[fieldName] && !!touched[fieldName];
    const state = hasError ? " border-destructive ring-destructive/20" : " border-border focus:ring-accent/20";
    return `${base}${state}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // run validation for all fields
    const validation = runValidation();
    // mark all as touched so errors show
    const allTouched: Record<string, boolean> = {};
    Object.keys(validation).forEach((k) => (allTouched[k] = true));
    setTouched((t) => ({ ...t, ...allTouched }));

    if (Object.keys(validation).length > 0) {
      // there are validation errors
      return;
    }

    setLoading(true);
    try {
      const payload = {
        truck_type: truckType,
        truck_name: truckName,
        truck_number: truckNumber,
        actual_length: actualLength === "" ? null : parseFloat(actualLength),
        actual_width: actualWidth === "" ? null : parseFloat(actualWidth),
        actual_height: actualHeight === "" ? null : parseFloat(actualHeight),
        available_length: availableLength === "" ? null : parseFloat(availableLength),
        available_width: availableWidth === "" ? null : parseFloat(availableWidth),
        available_height: availableHeight === "" ? null : parseFloat(availableHeight),
        capacity_tons: capacityTons === "" ? null : parseFloat(capacityTons),
        availability_status: availabilityStatus,
        origin: origin,
        destination: destination,
        notes: notes,
      };

      let res;
      if (initialData && initialData.id) {
        res = await fetch(`http://localhost:8000/providers/trucks/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("http://localhost:8000/providers/trucks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to save truck");
      }

      showStatus("success", "Truck saved successfully.");
      setTruckType("");
      setTruckName("");
      setTruckNumber("");
      setActualLength("");
      setActualWidth("");
      setActualHeight("");
      setAvailableLength("");
      setAvailableWidth("");
      setAvailableHeight("");
      setCapacityTons("");
      setAvailabilityStatus("Available");
      setOrigin("");
      setDestination("");
      setNotes("");
      setErrors({});
      setTouched({});
      // notify parent to close dialog and refresh list
      if (onSaved) onSaved();
    } catch (err: any) {
      console.error(err);
      showStatus("error", "Error saving truck: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // populate form when initialData changes (edit mode)
  useEffect(() => {
    if (initialData) {
      setTruckType(initialData.truck_type || "");
      setTruckName(initialData.truck_name || "");
      setTruckNumber(initialData.truck_number || "");
      setActualLength(initialData.actual_length ?? "");
      setActualWidth(initialData.actual_width ?? "");
      setActualHeight(initialData.actual_height ?? "");
      setAvailableLength(initialData.available_length ?? "");
      setAvailableWidth(initialData.available_width ?? "");
      setAvailableHeight(initialData.available_height ?? "");
      setCapacityTons(initialData.capacity_tons ?? "");
      setAvailabilityStatus(initialData.availability_status || "Available");
      setOrigin(initialData.origin || "");
      setDestination(initialData.destination || "");
      setNotes(initialData.notes || "");
      setErrors({});
      setTouched({});
    }
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {/* Status tooltip */}
      {status.type !== "idle" && (
        <div
          className={`flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-opacity duration-300 ${
            status.type === "success" ? "bg-green-100 text-green-800" : "bg-destructive/10 text-destructive"
          }`}
          role="status"
        >
          {status.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{status.message}</span>
        </div>
      )}
      <div>
        <Label>Truck Type</Label>
        <Input
          value={truckType}
          onChange={(e) => setTruckType(e.target.value)}
          onBlur={() => {
            markTouched("truck_type");
            const err = validateField("truck_type", truckType);
            setErrors((s) => ({ ...s, truck_type: err }));
          }}
          placeholder="e.g. HCV, LCV, Container"
          className={inputClass("truck_type")}
        />
        {errors.truck_type && touched.truck_type && (
          <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.truck_type}</div>
        )}
      </div>

      <div>
        <Label>Truck Name</Label>
        <Input
          value={truckName}
          onChange={(e) => setTruckName(e.target.value)}
          onBlur={() => {
            markTouched("truck_name");
            const err = validateField("truck_name", truckName);
            setErrors((s) => ({ ...s, truck_name: err }));
          }}
          placeholder="Enter truck name or identifier"
          className={inputClass("truck_name")}
        />
        {errors.truck_name && touched.truck_name && (
          <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.truck_name}</div>
        )}
      </div>

      <div>
        <Label>Truck Number</Label>
        <Input
          value={truckNumber}
          onChange={(e) => setTruckNumber(e.target.value)}
          onBlur={() => {
            markTouched("truck_number");
            const err = validateField("truck_number", truckNumber);
            setErrors((s) => ({ ...s, truck_number: err }));
          }}
          placeholder="Vehicle registration / number"
          className={inputClass("truck_number")}
        />
        {errors.truck_number && touched.truck_number && (
          <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.truck_number}</div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label>Actual Length (m)</Label>
          <Input
            value={actualLength}
            onChange={(e) => {
              setActualLength(e.target.value);
              if (touched["actual_length"]) {
                const err = validateField("actual_length", e.target.value);
                setErrors((s) => ({ ...s, actual_length: err }));
              }
            }}
            onBlur={() => {
              markTouched("actual_length");
              const err = validateField("actual_length", actualLength);
              setErrors((s) => ({ ...s, actual_length: err }));
            }}
            type="number"
            step="0.01"
            placeholder="e.g. 6.00"
            className={inputClass("actual_length")}
          />
          {errors.actual_length && touched.actual_length && (
            <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.actual_length}</div>
          )}
        </div>
        <div>
          <Label>Actual Width (m)</Label>
          <Input
            value={actualWidth}
            onChange={(e) => {
              setActualWidth(e.target.value);
              if (touched["actual_width"]) {
                const err = validateField("actual_width", e.target.value);
                setErrors((s) => ({ ...s, actual_width: err }));
              }
            }}
            onBlur={() => {
              markTouched("actual_width");
              const err = validateField("actual_width", actualWidth);
              setErrors((s) => ({ ...s, actual_width: err }));
            }}
            type="number"
            step="0.01"
            placeholder="e.g. 2.50"
            className={inputClass("actual_width")}
          />
          {errors.actual_width && touched.actual_width && (
            <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.actual_width}</div>
          )}
        </div>
        <div>
          <Label>Actual Height (m)</Label>
          <Input
            value={actualHeight}
            onChange={(e) => {
              setActualHeight(e.target.value);
              if (touched["actual_height"]) {
                const err = validateField("actual_height", e.target.value);
                setErrors((s) => ({ ...s, actual_height: err }));
              }
            }}
            onBlur={() => {
              markTouched("actual_height");
              const err = validateField("actual_height", actualHeight);
              setErrors((s) => ({ ...s, actual_height: err }));
            }}
            type="number"
            step="0.01"
            placeholder="e.g. 2.50"
            className={inputClass("actual_height")}
          />
          {errors.actual_height && touched.actual_height && (
            <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.actual_height}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label>Available Length (m)</Label>
          <Input
            value={availableLength}
            onChange={(e) => {
              setAvailableLength(e.target.value);
              if (touched["available_length"]) {
                const err = validateField("available_length", e.target.value);
                setErrors((s) => ({ ...s, available_length: err }));
              }
            }}
            onBlur={() => {
              markTouched("available_length");
              const err = validateField("available_length", availableLength);
              setErrors((s) => ({ ...s, available_length: err }));
            }}
            type="number"
            step="0.01"
            placeholder="e.g. 5.50"
            className={inputClass("available_length")}
          />
          {errors.available_length && touched.available_length && (
            <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.available_length}</div>
          )}
        </div>
        <div>
          <Label>Available Width (m)</Label>
          <Input
            value={availableWidth}
            onChange={(e) => {
              setAvailableWidth(e.target.value);
              if (touched["available_width"]) {
                const err = validateField("available_width", e.target.value);
                setErrors((s) => ({ ...s, available_width: err }));
              }
            }}
            onBlur={() => {
              markTouched("available_width");
              const err = validateField("available_width", availableWidth);
              setErrors((s) => ({ ...s, available_width: err }));
            }}
            type="number"
            step="0.01"
            placeholder="e.g. 2.40"
            className={inputClass("available_width")}
          />
          {errors.available_width && touched.available_width && (
            <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.available_width}</div>
          )}
        </div>
        <div>
          <Label>Available Height (m)</Label>
          <Input
            value={availableHeight}
            onChange={(e) => {
              setAvailableHeight(e.target.value);
              if (touched["available_height"]) {
                const err = validateField("available_height", e.target.value);
                setErrors((s) => ({ ...s, available_height: err }));
              }
            }}
            onBlur={() => {
              markTouched("available_height");
              const err = validateField("available_height", availableHeight);
              setErrors((s) => ({ ...s, available_height: err }));
            }}
            type="number"
            step="0.01"
            placeholder="e.g. 2.40"
            className={inputClass("available_height")}
          />
          {errors.available_height && touched.available_height && (
            <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.available_height}</div>
          )}
        </div>
      </div>

      <div>
        <Label>Capacity (tons)</Label>
        <Input
          value={capacityTons}
          onChange={(e) => {
            setCapacityTons(e.target.value);
            if (touched["capacity_tons"]) {
              const err = validateField("capacity_tons", e.target.value);
              setErrors((s) => ({ ...s, capacity_tons: err }));
            }
          }}
          onBlur={() => {
            markTouched("capacity_tons");
            const err = validateField("capacity_tons", capacityTons);
            setErrors((s) => ({ ...s, capacity_tons: err }));
          }}
          type="number"
          step="0.01"
          placeholder="e.g. 10"
          className={inputClass("capacity_tons")}
        />
        {errors.capacity_tons && touched.capacity_tons && (
          <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.capacity_tons}</div>
        )}
      </div>

        <div>
          <Label className="block mb-2">Availability Status</Label>
          <select
            value={availabilityStatus}
            onChange={(e) => setAvailabilityStatus(e.target.value)}
            onBlur={() => {
              markTouched("availability_status");
              const err = validateField("availability_status", availabilityStatus);
              setErrors((s) => ({ ...s, availability_status: err }));
            }}
            className={inputClass("availability_status")}
          >
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
        </div>

        <div>
          <Label className="block mb-2">Origin</Label>
          <Input
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              if (touched["origin"]) {
                const err = validateField("origin", e.target.value);
                setErrors((s) => ({ ...s, origin: err }));
              }
            }}
            onBlur={() => {
              markTouched("origin");
              const err = validateField("origin", origin);
              setErrors((s) => ({ ...s, origin: err }));
            }}
            placeholder="City / Depot / GPS hint"
            className={inputClass("origin")}
          />
          {errors.origin && touched.origin && (
            <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.origin}</div>
          )}
        </div>

        <div>
          <Label className="block mb-2">Destination</Label>
          <Input
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              if (touched["destination"]) {
                const err = validateField("destination", e.target.value);
                setErrors((s) => ({ ...s, destination: err }));
              }
            }}
            onBlur={() => {
              markTouched("destination");
              const err = validateField("destination", destination);
              setErrors((s) => ({ ...s, destination: err }));
            }}
            placeholder="City / Depot / GPS hint"
            className={inputClass("destination")}
          />
          {errors.destination && touched.destination && (
            <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.destination}</div>
          )}
        </div>

        <div>
          <Label className="block mb-2">Notes</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => {
              markTouched("notes");
              const err = validateField("notes", notes);
              setErrors((s) => ({ ...s, notes: err }));
            }}
            className={inputClass("notes")}
            rows={4}
          />
          {errors.notes && touched.notes && (
            <div className="mt-1 text-sm text-destructive bg-destructive/10 px-2 py-1 rounded">{errors.notes}</div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl text-lg font-semibold text-white shadow-md bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-95 focus:outline-none focus:ring-4 focus:ring-rose-300"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </div>
      </form>
  );
};

export default ProviderDashboard;
