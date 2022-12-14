import type { NextPage } from "next";
import Game from "../components/Game/Game";
import Head from 'next/head'


const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Tollywoodle</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={"Telugu tollywood movie fun quiz"} />
      </Head>
      <Game />
    </>
  );
};

export default Home;