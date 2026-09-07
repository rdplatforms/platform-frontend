import type { Card } from '@rdplatforms/types';
import type { CardStyleConfig } from '../cardStyles';

export interface CardTemplateProps {
  card: Card;
  style: CardStyleConfig;
}
