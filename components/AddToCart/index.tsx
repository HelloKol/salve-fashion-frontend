import { useCookies } from "react-cookie"
import Button from "../Button"
import {
  ADD_TO_CART,
  SINGLE_PRODUCT_BY_HANDLE,
  SINGLE_PRODUCT_BY_ID,
} from "@/services/queries"
import { graphqlClient } from "@/utils"
import { useShoppingCart } from "@/context/Cart"
import { ImageTag, RadixPopover } from "@/components"
import { ShopifySingleProduct } from "@/types"
import { useState } from "react"

export default function AddToCart({
  selectedVariantTitle,
  selectedVariant,
  disabled,
}: {
  selectedVariantTitle: string
  selectedVariant: any
  disabled?: boolean
}) {
  if (!selectedVariant) return null
  const { setCartItems, fetchCartItems, cartItems } = useShoppingCart()
  const [cookies] = useCookies(["checkoutId"])
  let checkoutId: string = cookies["checkoutId"]
  const { id, image, selectedOptions } = selectedVariant

  const handleAddToCart = async () => {
    const quantity = 1
    const variables = {
      checkoutId,
      lineItems: [{ id, quantity }],
    }

    try {
      const response: any = await graphqlClient.request(ADD_TO_CART, variables)
      console.log("Updated checkout IN HANDLE:", response?.checkoutLineItemsAdd)
      const items =
        response?.checkoutLineItemsAdd?.checkout?.lineItems?.edges.map(
          ({ node }: any) => ({
            id: node.id,
            title: node.title,
            quantity: node.quantity,
            variant: node.variant,
            imageUrl: node.variant.image?.originalSrc,
          })
        )
      setCartItems(items)
      fetchCartItems()
      return response?.checkoutLineItemsAdd?.checkout
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const renderVariantOptions = () =>
    selectedOptions &&
    selectedOptions.map((item: any) => {
      const { name, value } = item

      return (
        <div>
          {name}: {value}
        </div>
      )
    })

  return (
    <RadixPopover
      trigger={
        <button onClick={handleAddToCart} disabled={disabled}>
          {disabled ? `Sold out` : `Add to cart`}
        </button>
      }
    >
      <div className="flex items-center gap-2">
        <svg
          className="h-4 w-4 text-gray-800 "
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m5 12 4.7 4.5 9.3-9"
          />
        </svg>
        <p>Item added to your cart</p>
      </div>

      <div className="mt-8 flex gap-4">
        <div className="h-28 w-24 flex-none">
          <ImageTag src={image?.transformedSrc} />
        </div>

        <div>
          <h1>{selectedVariantTitle}</h1>
          <div className="mt-2">{renderVariantOptions()}</div>
        </div>
      </div>

      <Button className={`mt-8 w-full`} variant={"quaternary"}>
        View cart ({cartItems?.length})
      </Button>
    </RadixPopover>
  )
}
