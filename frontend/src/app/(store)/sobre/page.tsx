import { apiServer } from '@/lib/api';

interface StoreInfoResponse {
  name: string;
  aboutTitle: string;
  aboutContent: string;
}

export default async function SobrePage() {
  const storeInfo = await apiServer<StoreInfoResponse>('/store-info');

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-primary">
        {storeInfo.aboutTitle}
      </h1>
      <div className="prose prose-lg text-primary-light">
        {storeInfo.aboutContent.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
