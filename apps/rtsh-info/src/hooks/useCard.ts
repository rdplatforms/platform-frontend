import { useParams } from 'react-router-dom';
import { findCardByIdentifier } from '../data/cardRegistry';

export function useCard() {
  const { identifier } = useParams<{ identifier: string }>();
  const card = identifier ? findCardByIdentifier(identifier) : undefined;
  return { card, identifier };
}
