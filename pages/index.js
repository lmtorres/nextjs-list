import React, {useState} from "react";
import Table, {SelectColumnFilter} from "../components/Table";
import Router, {useRouter} from "next/router";
import CreatableSelect from 'react-select/creatable';
import { ActionMeta, OnChangeValue } from 'react-select';
import { TrashIcon, PencilAltIcon } from '@heroicons/react/solid';

const Home = props => {
  const setDefaultTeams = () => {
    return props.teams.map(t => ({
      "value" : t.id,
      "label" : t.name
    }));
  }

  const [showModal, setShowModal] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [team, setTeam] = useState('');
  const [teams, setTeams] = useState(setDefaultTeams());

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
      {
        Header: "Actions",
        accessor: "id",
        disableSortBy: true,
        disableFilters: true,
        Cell: ({ value, row }) => {
          /*return row.original.id;*/
          return (
            <div className="flex justify-center">
              <PencilAltIcon className="h-5 w-5 text-sky-400" aria-hidden="true" />
              <button onClick={() => {
                setShowConfirmDialog(true);
              }}><TrashIcon className="h-5 w-5 text-red-500" aria-hidden="true" /></button>
            </div>
          )
        }
      }
    ],
    []
  );

  const data = React.useMemo(() => props.players, []);


  const filterTeams = (inputValue) => {
    return teams.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const handleChangeTeam = (newValue, action) => {
    setTeam(newValue);
  }

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }

  const submitData = async e => {
    e.preventDefault()
    try {
      const body = { name, description, team }
      await fetch(`/api/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setShowModal(false);
      setName('');
      setDescription('');
      setTeam('');
      refreshData();
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="">
            <h1 className="text-xl font-semibold">MLB Players</h1>
          </div>
          <div className="mt-4 float-right">
            <button
              className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Add Player
            </button>
          </div>
          <div className="mt-4">
            <Table columns={columns} data={data} />
          </div>
        </main>
      </div>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none w-96">
                <form
                  onSubmit={submitData}>
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Add Player
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                    </button>
                  </div>
                  <div className="relative p-6 flex-auto">
                    <input
                      autoFocus
                      onChange={e => setName(e.target.value)}
                      placeholder="Name"
                      type="text"
                      value={name}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <input
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Description"
                      type="text"
                      value={description}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <CreatableSelect
                      options={teams}
                      isClearable={true}
                      placeholder="Start typing a team name..."
                      onChange={handleChangeTeam}
                      loadOptions={filterTeams}
                      classNamePrefix="select2-selection"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      disabled={!description || !name || !team}
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                      /*onClick={() => setShowModal(false)}*/
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
      ) : null}

      {showConfirmDialog ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none w-96">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Are you sure?
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowConfirmDialog(false)}
                    >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                    </button>
                  </div>
                  <div className="relative p-6 flex-auto">
                    This action cannot be undone.
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowConfirmDialog(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      /*onClick={() => setShowModal(false)}*/
                    >
                      Confirm
                    </button>
                  </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black" />
        </>
      ) : null}
    </>
  )
}

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:3000/api/feed')
  const feed = await res.json()
  return {
    props: feed,
  }
}

export default Home;
