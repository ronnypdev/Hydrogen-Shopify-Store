import {CartForm} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {useState} from 'react';

type CartLineUpdateButton = {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
};

export default function CartLineUpdateButton() {
  const [updating, setUpdating] = useState<boolean>(false);

  return <CartForm></CartForm>;
}
