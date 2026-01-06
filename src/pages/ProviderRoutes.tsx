import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ProviderRoutes = () => {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [selectedTruck, setSelectedTruck] = useState<number | null>(null);
  const [routes, setRoutes] = useState<any[]>([]);
  const [newRouteName, setNewRouteName] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [editingRouteId, setEditingRouteId] = useState<number | null>(null);
  const [places, setPlaces] = useState<Array<{ address: string; lat?: number | null; lng?: number | null }>>([
    { address: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const fetchTrucks = async () => {
    try {
      const res = await fetch('http://localhost:8000/providers/trucks?limit=100');
      const body = await res.json();
      setTrucks(body.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoutes = async (truckId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/providers/trucks/${truckId}/routes`);
      const body = await res.json();
      setRoutes(body.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  useEffect(() => {
    if (selectedTruck) fetchRoutes(selectedTruck);
  }, [selectedTruck]);

  const addPlace = () => setPlaces((p) => [...p, { address: '' }]);
  const removePlace = (i: number) => setPlaces((p) => p.filter((_, idx) => idx !== i));
  const updatePlace = (i: number, val: string) => setPlaces((p) => p.map((pl, idx) => idx === i ? { ...pl, address: val } : pl));

  const saveRoute = async () => {
    if (!selectedTruck) return alert('Select a truck');
    const data = {
      name: newRouteName,
      notes: newNotes,
      places: places.map((p, i) => ({ address: p.address, seq: i + 1, lat: p.lat ?? null, lng: p.lng ?? null }))
    };
    setLoading(true);
    try {
      let res;
      if (editingRouteId) {
        res = await fetch(`http://localhost:8000/providers/routes/${editingRouteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } else {
        res = await fetch(`http://localhost:8000/providers/trucks/${selectedTruck}/routes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
      if (!res.ok) throw new Error('Failed to save');
      setNewRouteName(''); setNewNotes(''); setPlaces([{ address: '' }]);
      setEditingRouteId(null);
      await fetchRoutes(selectedTruck);
    } catch (err) {
      console.error(err);
      alert('Error saving route');
    } finally {
      setLoading(false);
    }
  };

  const deleteRoute = async (id: number) => {
    if (!confirm('Delete this route?')) return;
    try {
      const res = await fetch(`http://localhost:8000/providers/routes/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      if (selectedTruck) fetchRoutes(selectedTruck);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const onEdit = (route: any) => {
    setEditingRouteId(route.id);
    setNewRouteName(route.name || '');
    setNewNotes(route.notes || '');
    setPlaces((route.places || []).map((p: any) => ({ address: p.address || '', lat: p.lat ?? null, lng: p.lng ?? null })));
    // scroll to top of form or focus — leave to browser for now
  };

  return (
    <DashboardLayout role="provider">
      <div className="space-y-6">
        <div className="rounded-lg bg-card border border-border p-4">
          <h2 className="text-lg font-semibold mb-3">Manage Routes</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <Label>Truck</Label>
              <select value={String(selectedTruck || '')} onChange={(e) => { const v = e.target.value; setSelectedTruck(v ? Number(v) : null); }} className="w-full h-10 rounded-md border border-border px-3 bg-transparent">
                <option value="">Select truck</option>
                {trucks.map(t => {
                  const routeSummary = t.route_summary || (t.origin || t.destination ? `${t.origin || ''}${t.origin && t.destination ? ' - ' : ''}${t.destination || ''}` : '');
                  return (
                    <option key={t.id} value={t.id}>{t.truck_name} — {t.truck_type} — {t.capacity_tons ?? '-'}t{routeSummary ? ` — ${routeSummary}` : ''}</option>
                  );
                })}
              </select>
            </div>
            <div>
              <Label>Route Name</Label>
              <Input value={newRouteName} onChange={(e) => setNewRouteName(e.target.value)} />
            </div>
            <div>
              <Label>Notes</Label>
              <Input value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Places (sequence)</h3>
              <Button size="sm" onClick={addPlace}>Add Place</Button>
            </div>
            {places.map((p, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1">
                  <Input placeholder={`Place ${i+1} address`} value={p.address} onChange={(e) => updatePlace(i, e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="destructive" size="sm" onClick={() => removePlace(i)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Button onClick={saveRoute} disabled={loading}>{loading ? 'Saving...' : 'Save Route'}</Button>
          </div>
        </div>

        <div className="rounded-lg bg-card border border-border p-4">
          <h3 className="text-lg font-semibold mb-3">Assigned Routes</h3>
          {selectedTruck ? (
            routes.length === 0 ? <div className="text-sm text-muted-foreground">No routes assigned.</div> : (
              <ul className="space-y-3">
                {routes.map(r => (
                  <li key={r.id} className="border p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{r.name || `Route #${r.id}`}</div>
                        <div className="text-sm text-muted-foreground">{r.notes}</div>
                        <div className="mt-1 font-medium text-sm">
                          {r.places && r.places.length > 0 ? `${r.places[0].address} — ${r.places[r.places.length-1].address}` : 'No places'}
                        </div>
                        <ol className="mt-2 ml-4 list-decimal text-sm">
                          {(r.places || []).map((pl:any) => <li key={pl.id}>{pl.address}</li>)}
                        </ol>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(r)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteRoute(r.id)}>Delete</Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <div className="text-sm text-muted-foreground">Select a truck to see assigned routes.</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProviderRoutes;
