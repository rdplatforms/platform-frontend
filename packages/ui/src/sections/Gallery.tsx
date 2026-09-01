import { ImageList, ImageListItem, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { useGallery, useLocale } from '@rdplatforms/hooks';
import { resolveLocalizedText, translateUi } from '@rdplatforms/utils';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function Gallery({ business, config }: SectionProps) {
  const { locale } = useLocale();
  const { data: items, isLoading } = useGallery(business.id);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.down('md'));
  const cols = isXs ? 1 : isSm ? 2 : 3;

  return (
    <PageSection id="gallery">
      <SectionTitle
        title={resolveLocalizedText(config.title, locale) || translateUi('gallery', locale)}
        subtitle={resolveLocalizedText(config.subtitle, locale)}
      />

      {isLoading ? (
        <Skeleton variant="rounded" height={400} />
      ) : (
        <ImageList variant="quilted" cols={cols} gap={12}>
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
