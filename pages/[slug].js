import { client } from "../lib/apollo";
import { gql } from "@apollo/client";

import Head from "next/head";

export default function SlugPage({ post }) {
  return (
    <div>
      <Head>
        <title>Headless WP Next Starter</title>
        <link rel="icon" href="favicon.ico"></link>
      </Head>

      <main>
        <div className="siteHeader">
          <h1 className="title">{post.title}</h1>
          <p>
            ✍️ &nbsp;&nbsp;
            {`${post.author.node.firstName} ${post.author.node.lastName}`} | 🗓️
            &nbsp;&nbsp;{new Date(post.date).toLocaleDateString()}
          </p>
        </div>
        <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
      </main>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const GET_POST = gql`
    query GetPostByURI($id: ID!) {
      post(id: $id, idType: SLUG) {
        title
        content
        date
        author {
          node {
            firstName
            lastName
          }
        }
      }
    }
  `;
  //  the params argument for this function corresponds to the dynamic URL segments
  //  we included in our page-based route. So, in this case, the `params` object will have
  //  a property named `uri` that contains that route segment when a user hits the page
  const response = await client.query({
    query: GET_POST,
    variables: {
      id: params.slug,
    },
  });
  const post = response?.data?.post;
  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const paths = ["/about"];
  return {
    paths,
    fallback: "blocking",
  };
}
