'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface FilterSidebarProps {
  categories: string[];
  colors: string[];
  sizes: string[];
}

export function FilterSidebar({ categories, colors, sizes }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') ?? '';
  const activeColor = searchParams.get('color') ?? '';
  const activeSize = searchParams.get('size') ?? '';

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    router.push(`/camisas?${params.toString()}`);
  }

  function clearFilters() {
    router.push('/camisas');
  }

  const hasActiveFilters = activeCategory || activeColor || activeSize;

  return (
    <aside className="w-full space-y-6 rounded-lg border border-brand-200 p-4 md:w-64">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Filtros</h2>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-accent hover:underline">
            Limpar
          </button>
        )}
      </div>

      <FilterGroup
        label="Categoria"
        options={categories}
        active={activeCategory}
        onChange={(v) => updateFilter('category', v)}
      />

      <FilterGroup
        label="Cor"
        options={colors}
        active={activeColor}
        onChange={(v) => updateFilter('color', v)}
      />

      <FilterGroup
        label="Tamanho"
        options={sizes}
        active={activeSize}
        onChange={(v) => updateFilter('size', v)}
      />
    </aside>
  );
}

function FilterGroup({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: string[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase text-primary-light">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onChange(active === option ? '' : option)}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              active === option
                ? 'bg-accent text-white'
                : 'bg-brand-100 text-primary-light hover:bg-brand-200'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
