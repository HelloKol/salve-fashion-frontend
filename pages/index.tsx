import { GetStaticPropsResult } from "next"
import groq from "groq"
import {
  AboutUs,
  Carousel,
  Category,
  FollowUs,
  HorizontalFeed,
  Main,
  NewArrivals,
  VideoPlayer,
} from "@/components"
import { ShopifyProduct } from "@/types"
import { ALL_PRODUCTS } from "@/services/queries"
import { graphqlClient } from "@/utils/graphql"
import { sanityClient } from "@/utils/sanity"
import Head from "next/head"

interface props {
  page: any
  products: ShopifyProduct[]
  instagramAccount: any
  instagramPosts: any
}

export default function Home({
  page,
  products,
  instagramAccount,
  instagramPosts,
}: props): JSX.Element | null {
  if (!page) return null
  const { body, collections } = page

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Main className="p-0">
        <Carousel collections={collections} />
        <HorizontalFeed title={"New In Men"} data={[]} href={`/shop/men`} />
        <AboutUs />
        <NewArrivals />
        <Category />
        <HorizontalFeed title={"New In Women"} data={[]} href={`/shop/women`} />
        <VideoPlayer videoSrc={"/static/video/y2.mp4"} />
        <FollowUs
          title={"Follow us on instagram"}
          instagramAccount={instagramAccount}
          instagramPosts={instagramPosts}
        />
      </Main>
    </>
  )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<props>> {
  try {
    const page: any = await sanityClient.fetch(
      groq`*[_type == "home"][0] {
      body,
      hero,
      seo,
      modules[] {
        ...
      },
      collections[]-> {
          ...,
          modules[] {
            ...,
            image{
              _type,
              asset->{
                _id,
                url
              }
            }
          },
      },
    }
    `
    )

    const products: any = await graphqlClient.request(ALL_PRODUCTS)

    const instagramAccountRes = await fetch(
      `https://salvefashion.com/api/instagramAccount?accessToken=${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}`
    )
    const instagramAccount = await instagramAccountRes.json()
    const instagramPostsRes = await fetch(
      `https://salvefashion.com/api/instagramPosts?accessToken=${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}`
    )
    const instagramPostsData = await instagramPostsRes.json()
    const instagramPosts = instagramPostsData.data ?? []

    return {
      props: {
        page,
        products: products.products.edges,
        instagramAccount,
        instagramPosts,
      },
      revalidate: 60,
    }
  } catch (err) {
    return {
      notFound: true,
    }
  }
}
