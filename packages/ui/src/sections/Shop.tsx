import { Badge, Button, Grid, Skeleton, Stack, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link as RouterLink } from 'react-router-dom';
import { useOptionalCart } from '@rdplatforms/contexts';
import { useLocale, useProducts } from '@rdplatforms/hooks';
import { formatCurrency, resolveLocalizedText, translateUi } from '@rdplatforms/utils';
import { Card } from '../primitives/Card';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

/**
 * Products come from activeDataSource (ProductService) — a Tier 1
 * business with no backend gets its products from
 * static-data/products.json, same as Services/Gallery/etc.; a Tier 3
 * business gets them from platform-backend. See docs/shop.md.
 *
 * Cart access is optional (useOptionalCart, not useCart) because
 * @rdplatforms/ui is shared by any app that composes SectionRenderer —
 * only apps/website actually wraps its tree in a CartProvider. A
 * business with the shop section enabled outside that context (there
 * isn't one today, but nothing stops it structurally) still renders
 * correctly, just with "Add to Cart" disabled.
 */
export function Shop({ business, config }: SectionProps) {
  const { locale } = useLocale();
  const { data: products, isLoading } = useProducts(business.id);
  const cart = useOptionalCart();

  return (
    <PageSection id="shop" tone="subtle">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
      >
        <SectionTitle
          title={resolveLocalizedText(config.title, locale) || translateUi('ourShop', locale)}
          subtitle={resolveLocalizedText(config.subtitle, locale)}
        />
        {cart && cart.itemCount > 0 ? (
          <Button
            component={RouterLink}
            to="/cart"
            variant="outlined"
            startIcon={
              <Badge badgeContent={cart.itemCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            }
          >
            {translateUi('viewCart', locale)}
          </Button>
        ) : null}
      </Stack>

      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rounded" height={260} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {(products ?? []).map((product) => {
            const outOfStock = product.stockQuantity !== undefined && product.stockQuantity <= 0;
            return (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  title={product.name}
                  description={product.description}
                  imageUrl={product.imageUrl}
                  footer={
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                        {formatCurrency(product.price, product.currency)}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        disabled={outOfStock || !cart}
                        onClick={() =>
                          cart?.addItem({
                            productId: product.id,
                            name: product.name,
                            price: product.price,
                            currency: product.currency,
                            category: product.category,
                            imageUrl: product.imageUrl,
                          })
                        }
                      >
                        {outOfStock
                          ? translateUi('outOfStock', locale)
                          : translateUi('addToCart', locale)}
                      </Button>
                    </Stack>
                  }
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </PageSection>
  );
}
