import { ReactElement } from 'react';
import { useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';

import styled from '@emotion/styled';
import getAmazonProducts from "../utils/getAmazonProducts"

const Container = styled.main`
  position: relative;
  margin: 0 auto;
  height: 200px;
  width: calc(100% - 30px);
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Table = styled.table`
  position: relative;
  margin: 0 auto;
  width: calc(100% - 30px);
  font-size: 2rem;

  thead {
    background: #dddddd;
  }

  tr:nth-child(even) {
    background: #efefef;
  }

  td {
    padding: 5px;
  }

  img {
    width: 200px;
  }
`

const TextTitle = styled.h1`
  color: black;
`

const InputSearch = styled.input`
  background: white;
  border: 1px solid black;
  width: calc(100% - 30px);
  margin-bottom: 15px;
  max-width: 300px;
`

const InputButton = styled.input`
  background: white;
  color: black;
  width: 75px;
  transition: 0.1s;
  cursor: pointer;
  border: 1px solid black;

  &:hover {
    opacity: 0.8;
  }
`

export default function Home(): ReactElement {
  const [url, setURL] = useState("")
  const [products, setProducts] = useState([] as any[])

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <TextTitle>Amazon Search</TextTitle>
        <InputSearch type="text" onChange={(e) => setURL(e.target.value)} />
        <InputButton type="button" value="Search" onClick={async () => {
          const producters = await getAmazonProducts(url)
          setProducts(producters)
        }} />
      </Container>

      <Table className="iframe-container">
        <thead>
          <tr>
            <td>Picture</td>
            <td>Description</td>
            <td>Price</td>
            <td>Link</td>
            <td>Sold By</td>
            <td>Ranking</td>
            <td>ASIN</td>
            <td>Sellers</td>
          </tr>
        </thead>
        <tbody className="table-products-body">
          {products.map(prod => (
            <tr>
              <td>
                <img src={prod.img} />
              </td>
              <td>{prod.name}</td>
              <td>{prod.price}</td>
              <td>
                <a href={prod.link} target="_blank">Click Here</a>
              </td>
              <td>{prod.soldBy}</td>
              <td>{prod.rank}</td>
              <td>{prod.asin}</td>
              <td>{prod.sellers}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
