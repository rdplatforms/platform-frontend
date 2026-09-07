import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import type { CardLink } from '@rdplatforms/types';
import { toWhatsAppLink } from '@rdplatforms/utils';

/**
 * The only place that has to change when a new `CardLink.type` is
 * introduced: one icon entry here, plus href/label handling below if it
 * needs anything other than "treat the value as a URL." An unlisted
 * type still renders — generic link icon, value used as-is.
 */
const ICONS: Record<string, ComponentType<SvgIconProps>> = {
  call: CallIcon,
  whatsapp: WhatsAppIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  instagram: InstagramIcon,
  website: LanguageIcon,
  email: EmailIcon,
};

const LABELS: Record<string, string> = {
  call: 'Call',
  whatsapp: 'WhatsApp',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  instagram: 'Instagram',
  website: 'Website',
  email: 'Email',
};

export function iconForLink(link: CardLink): ComponentType<SvgIconProps> {
  return ICONS[link.type] ?? LinkIcon;
}

export function labelForLink(link: CardLink): string {
  return link.label ?? LABELS[link.type] ?? link.type;
}

export function hrefForLink(link: CardLink): string {
  switch (link.type) {
    case 'call':
      return `tel:${link.value}`;
    case 'whatsapp':
      return toWhatsAppLink(link.value);
    case 'email':
      return `mailto:${link.value}`;
    default:
      return /^https?:\/\//.test(link.value) ? link.value : `https://${link.value}`;
  }
}
