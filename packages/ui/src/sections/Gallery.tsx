import { ImageList, ImageListItem, Skeleton } from '@mui/material';
import { useGallery, useLocale } from '@rdplatforms/hooks';
import { resolveLocalizedText, translateUi } from '@rdplatforms/utils';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function Gallery({ business, config }: SectionProps) {
  const { locale } = useLocale();
  const { data: items, isLoading } = useGallery(business.id);

  return (
    <PageSection id="gallery">
      <SectionTitle
        title={resolveLocalizedText(config.title, locale) || translateUi('gallery', locale)}
        subtitle={resolveLocalizedText(config.subtitle, locale)}
      />

      {isLoading ? (
        <Skeleton variant="rounded" height={400} />
      ) : (
        <ImageList variant="quilted" cols={3} gap={12}>
          {(items ?? []).map((item) => (
            <ImageListItem key={item.id}>
              <img
                src={item.imageUrl}
                alt={resolveLocalizedText(item.title, locale) || business.displayName}
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
