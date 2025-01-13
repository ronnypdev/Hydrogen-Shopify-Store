import type {OptimisticCartLine} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import CartLineUpdateButton from './CartLineUpdateButton';
import CartLineRemoveButton from './CartlineRemoveButton';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

type CartLineQuantityAdjustor = {
  line: CartLine;
};

export default function CartLineQuantityAdjustor({
  line,
}: CartLineQuantityAdjustor) {
  if (!line || typeof line.quantity === 'undefined') {
    return null;
  }

  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number(Math.round(quantity + 1).toFixed(0));

  return (
    <div className="flex iems-center gap-2">
      <CartLineUpdateButton>
        
      </CartLineUpdateButton>

      <span className="font-source w-8 text-center">
        {quantity}
      </span>

      <CartLineUpdateButton >
        
      </CartLineUpdateButton>

      <CartLineRemoveButton />
    </div>
  );
}
