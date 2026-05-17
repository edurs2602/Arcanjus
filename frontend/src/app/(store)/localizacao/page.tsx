import { apiServer } from '@/lib/api';
import { MapView } from '@/components/store/MapView';
import { StoreHours } from '@/components/store/StoreHours';
import { StoreContact } from '@/components/store/StoreContact';

interface StoreInfoResponse {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  latitude: number;
  longitude: number;
  hours: Record<string, { open: string; close: string } | null>;
}

export default async function LocalizacaoPage() {
  const storeInfo = await apiServer<StoreInfoResponse>('/store-info');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-primary">Nossa Loja</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <StoreContact
            address={storeInfo.address}
            city={storeInfo.city}
            state={storeInfo.state}
            zipCode={storeInfo.zipCode}
            phone={storeInfo.phone}
          />
          <StoreHours hours={storeInfo.hours} />
        </div>

        <div>
          <MapView
            latitude={storeInfo.latitude}
            longitude={storeInfo.longitude}
            name={storeInfo.name}
          />
        </div>
      </div>
    </div>
  );
}
