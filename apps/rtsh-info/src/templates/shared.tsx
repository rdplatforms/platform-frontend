import { Avatar, Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { formatPhoneForDisplay, getAvatarColors, getInitials } from '@rdplatforms/utils';
import type { Card, CardLink } from '@rdplatforms/types';
import type { CardStyleConfig } from '../cardStyles';
import { hrefForLink, iconForLink, labelForLink } from '../linkPresentation';

/**
 * Building blocks every template composes differently — avatar
 * placement/size and link layout are exactly what varies template to
 * template, so they're the pieces worth sharing; each template still
 * owns its own overall structure.
 */

export function AvatarBadge({ card, style, size = 128 }: { card: Card; style: CardStyleConfig; size?: number }) {
  const colors = getAvatarColors(card.name);
  return (
    <Avatar
      src={card.photoUrl || undefined}
      alt={card.name}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        fontWeight: 700,
        bgcolor: colors.bg,
        color: colors.fg,
        border: `3px solid ${style.avatarRing}`,
      }}
    >
      {getInitials(card.name)}
    </Avatar>
  );
}

export function LinkButtonList({ links, style }: { links: CardLink[]; style: CardStyleConfig }) {
  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      {links.map((link, index) => {
        const Icon = iconForLink(link);
        return (
          <Button
            key={`${link.type}-${index}`}
            component="a"
            href={hrefForLink(link)}
            target={link.type === 'call' ? undefined : '_blank'}
            rel="noopener noreferrer"
            size="large"
            startIcon={<Icon />}
            fullWidth
            sx={style.buttonSx}
          >
            {labelForLink(link)}
          </Button>
        );
      })}
    </Stack>
  );
}

export function LinkIconGrid({
  links,
  style,
  columns = 3,
}: {
  links: CardLink[];
  style: CardStyleConfig;
  columns?: number;
}) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 2, width: '100%' }}>
      {links.map((link, index) => {
        const Icon = iconForLink(link);
        return (
          <Stack key={`${link.type}-${index}`} spacing={0.5} alignItems="center">
            <Tooltip title={labelForLink(link)}>
              <IconButton
                component="a"
                href={hrefForLink(link)}
                target={link.type === 'call' ? undefined : '_blank'}
                rel="noopener noreferrer"
                sx={style.iconButtonSx}
              >
                <Icon />
              </IconButton>
            </Tooltip>
            <Typography variant="caption" sx={{ color: style.secondaryTextColor }} noWrap>
              {labelForLink(link)}
            </Typography>
          </Stack>
        );
      })}
    </Box>
  );
}

export function ContactLines({
  card,
  style,
  align = 'center',
}: {
  card: Card;
  style: CardStyleConfig;
  align?: 'center' | 'flex-start';
}) {
  return (
    <Stack spacing={1} alignItems={align}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ color: style.secondaryTextColor }}>
        <PhoneIcon fontSize="small" />
        <Typography variant="body2">{formatPhoneForDisplay(card.phone)}</Typography>
      </Stack>
      {card.email ? (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: style.secondaryTextColor }}>
          <EmailIcon fontSize="small" />
          <Typography variant="body2">{card.email}</Typography>
        </Stack>
      ) : null}
    </Stack>
  );
}
