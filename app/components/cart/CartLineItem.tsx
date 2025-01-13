import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/cart/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from '@remix-run/react';
import {ProductPrice} from '../ProductPrice';
import {useAside} from '../Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import CartLineQuantityAdjustor from './CartLineQuantityAdjustor';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <div className="flex gap-4 py-6 border-b border-gray-100">
      {/* Product Image */}
      <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            className="object-cover w-full h-full"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px)50vw, 33vw"
          />
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={close}
          className="block"
        >
          <h3 className="font-playfair text-base text-brand-navy mb-1 truncate">
            {product.title}
          </h3>
        </Link>

        {/* Product Options */}
        <div className="mt-1 space-y-1">
          {selectedOptions.map((option) => (
            <p
              key={`${product.id}-${option.name}`}
              className="font-source text-sm text-gray-500"
            >
              {option.name}: {option.value}
            </p>
          ))}
        </div>

        {/* Price & Quantity Cotrols */}
        <div className="mt-4 flex items-center justify-between">
          <CartLineQuantityAdjustor line={line} />

          <div className="font-source font-medium">
            <ProductPrice price={line.cost.totalAmount} />
          </div>
        </div>


      </div>
    </div>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button disabled={disabled} type="submit">
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}
