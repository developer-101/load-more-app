import LoadMore from "./components/load-more";


export default function App() {

  const url = 'https://picsum.photos/v2/list';

  return (
    <>
      <LoadMore url={url} />
    </>
  )
}