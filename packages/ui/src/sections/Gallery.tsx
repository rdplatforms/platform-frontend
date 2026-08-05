import { ImageList, ImageListItem, Skeleton } from '@mui/material';
import { useGallery } from '@rdplatforms/hooks';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function Gallery({ business, config }: SectionProps) {
  const { data: items, isLoading } = useGallery(business.id);

  return (
    <PageSection id="gallery">
      <SectionTitle title={config.title ?? 'Gallery'} subtitle={config.subtitle} />

      {isLoading ? (
        <Skeleton variant="rounded" height={400} />
      ) : (
        <ImageList variant="quilted" cols={3} gap={12}>
          {(items ?? []).map((item) => (
            <ImageListItem key={item.id}>
              <img
                src={item.imageUrl}
                alt={item.title ?? business.displayName}
                loading="lazy"
                style={{ borderRadius: 8 }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </PageSection>
  );
}
