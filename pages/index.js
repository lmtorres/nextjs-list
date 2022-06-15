import React from "react";
import Table, {SelectColumnFilter} from "../components/Table";

const Home = props => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Team",
        accessor: "team.name",
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
    ],
    []
  );

  const data = React.useMemo(() => props.feed, []);
  
  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="">
            <h1 className="text-xl font-semibold">MLB Players</h1>
          </div>
          <div className="mt-4">
            <Table columns={columns} data={data} />
          </div>
        </main>
      </div>
    </>
  )
}

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/feed')
  const feed = await res.json()
  return {
    props: { feed },
  }
}

export default Home;
