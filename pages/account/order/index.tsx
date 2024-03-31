import { useEffect, useState } from "react"
import Link from "next/link"
import { useCookies } from "react-cookie"
import { useQuery } from "@tanstack/react-query"
import {
  AccountNavigation,
  Button,
  Container,
  Grid,
  ImageTag,
  Main,
  ProductSkeleton,
  RadixDialog,
  Section,
  Seo,
} from "@/components"
import { graphqlClient } from "@/utils"
import { EXAMPLE_PRODUCTS } from "@/services/queries"
import { useTruncateString } from "@/hooks"

interface PageProps {}

export default function Page({}: PageProps): JSX.Element | null {
  const [cookies, setCookie, removeCookie] = useCookies(["exampleOrderPage"])
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  const cookieValid: string = cookies["exampleOrderPage"]
  const orders = [
    {
      image: `/static/mock_product_images/men_1.webp`,
    },
    {
      image: `/static/mock_product_images/men_2.webp`,
    },
    {
      image: `/static/mock_product_images/men_3.webp`,
    },
    {
      image: `/static/mock_product_images/hoodie_1.webp`,
    },
    {
      image: `/static/mock_product_images/hoodie_2.webp`,
    },
  ]

  const { data, isLoading }: { data: any; isLoading: boolean } = useQuery({
    queryKey: ["getPredictive"],
    queryFn: async () => {
      return await graphqlClient.request(EXAMPLE_PRODUCTS)
    },
  })

  useEffect(() => {
    if (cookieValid) return setIsDialogOpen(false)
    return setIsDialogOpen(true)
  }, [])

  const handleCloseDialog = () => {
    setCookie("exampleOrderPage", true)
    setIsDialogOpen(false)
  }

  const renderProducts = () =>
    data?.products?.edges &&
    data.products.edges.map((item: any, index: any) => {
      const { node } = item
      const { featuredImage } = node
      const title = useTruncateString(node.title, 50)
      const firstVariant = node.variants.edges[0].node

      return (
        <div
          key={index}
          className="col-span-full mb-8 md:col-span-6 lg:mb-12 xl:col-span-4 xl:mb-14"
        >
          <p className="text-sm">{title}</p>
          <p className="text-sm">Delivered: 219143</p>
          <p className="text-sm">01/04/26</p>

          <div className="my-6 flex gap-6">
            <p className="text-sm">£{firstVariant.price.amount}</p>
            <Link href={"/"} className="text-sm">
              View order
            </Link>
          </div>

          <div className="relative h-[500px] w-full overflow-hidden rounded-md lg:h-[600px] xl:h-[700px]">
            <ImageTag src={featuredImage?.transformedSrc} />
          </div>
        </div>
      )
    })

  return (
    <>
      <Seo
        seo={{
          title: "Orders -",
        }}
      />
      <Main>
        <Section withPadding={false}>
          <Container>
            <Grid>
              <AccountNavigation />
              {isLoading ? (
                <ProductSkeleton />
              ) : !data?.products?.edges?.length ? (
                <h3 className="col-span-full text-center text-xl">
                  <b className="mb-2 block">We're sorry,</b>
                  We can't seem to find any results for
                </h3>
              ) : (
                renderProducts()
              )}
            </Grid>
          </Container>
        </Section>
      </Main>

      <RadixDialog
        variant={"exampleOrder"}
        isOpen={isDialogOpen}
        setIsOpen={() => {}}
      >
        <div className="p-5">
          <p className="mb-4 text-xl md:text-2xl lg:text-3xl">
            This page is an example of product orders.
          </p>
          <Button variant="tertiary" onClick={handleCloseDialog}>
            Understood
          </Button>
        </div>
      </RadixDialog>
    </>
  )
}
