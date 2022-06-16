import React, {useState} from "react";
import Table, {SelectColumnFilter} from "../components/Table";
import Router, {useRouter} from "next/router";
import CreatableSelect from 'react-select/creatable';
/*import { ActionMeta, OnChangeValue } from 'react-select';*/
import { TrashIcon, PencilAltIcon } from '@heroicons/react/solid';
import {useSession, signIn, signOut} from 'next-auth/react';

const Home = props => {
  const {data: session} = useSession();

  const setDefaultTeams = () => {
    return props.teams.map(t => ({
      "value" : t.id,
      "label" : t.name
    }));
  }

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [team, setTeam] = useState('');
  const [teams, setTeams] = useState(setDefaultTeams());
  const [playerId, setPlayerId] = useState('');
  const [editMode, setEditMode] = useState(false);

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
              <button onClick={() => {
                setPlayerId(row.original.id)
                setName(row.original.name)
                setDescription(row.original.description)
                setTeam({label: row.original.team.name, value: row.original.team.id})
                setEditMode(true)
                setShowModal(true)
              }}>
                <PencilAltIcon className="h-5 w-5 text-sky-400" aria-hidden="true" />
              </button>
              <button onClick={() => {
                setPlayerId(row.original.id)
                setShowConfirmDialog(true)
              }}>
                <TrashIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </button>
            </div>
          )
        }
      }
    ],
    []
  );

  // populate data for table
  const data = React.useMemo(() => props.players, []);

  // check if team already exists
  const filterTeams = (inputValue) => {
    return teams.filter((i) =>
      i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const handleChangeTeam = (newValue, action) => {
    setTeam(newValue)
  }

  /*const router = useRouter();*/
  const refreshData = async () => {
    await Router.push('/')
  }

  // method called when a player is created or updated
  const submitData = async e => {
    e.preventDefault()
    try {
      const body = { name, description, team }
      if (editMode){
        await fetch(`/api/players/${playerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        await fetch(`/api/teams`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      clearForm(e)
      setShowModal(false);
      setShowSuccess(true)
      await refreshData();
    } catch (error) {
      console.error(error)
    }
  }

  // clear form values
  const clearForm = e => {
    e.preventDefault()
    setEditMode(false)
    setName('')
    setDescription('')
    setTeam('')
  }

  // delete the player
  const destroy = async (id) => {
    await fetch(`/api/players/${id}`, {
      method: 'DELETE',
    })
    setShowSuccess(true)
    setShowConfirmDialog(false);
    await Router.push('/')
  }

  return (
    <>
      {showSuccess ? (
        <div className="bg-emerald-200 border border-emerald-600 text-emerald-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">The operation was completed successfully</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => {
            setShowSuccess(false);
          }}>
            <svg className="fill-current h-6 w-6 text-emerald-700" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      ) : null}
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex justify-between">
            <h1 className="text-xl font-semibold">MLB Players</h1>
            {session ? (
              <div>
                Signed in as {session.user.email} <br />
                <button className="float-right text-cyan-700 hover:text-cyan-900" onClick={() => signOut()}>Sign out</button>
              </div>
            ) : null}
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
      {showModal ?
        session || !editMode ? (
          <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none w-96">
                  <form
                    onSubmit={submitData}>
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                      <h3 className="text-3xl font-semibold">
                        {editMode ? 'Edit' : 'Add'} Player
                      </h3>
                      <button
                        className="background-transparent p-1 ml-auto border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                        onClick={(event) => {
                          clearForm(event)
                          setShowModal(false)
                        }}
                      >
                      <span className="text-black opacity-50 h-6 w-6 text-2xl block outline-none focus:outline-none">
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
                        defaultValue={team}
                        classNamePrefix="select2-selection"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="button"
                        onClick={(event) => {
                          clearForm(event)
                          setShowModal(false)
                        }}
                      >
                        Close
                      </button>
                      <button
                        disabled={!description || !name || !team}
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                      >
                        {editMode ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
          </>
        ) : (
          <SignInMessage
            clearForm={clearForm}
            onClose={() => {setShowModal(false)}}
          />
        ) : null}

      {showConfirmDialog ?
        session ? (
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
                      onClick={() => destroy(playerId)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
          </>
        ) : (
          <SignInMessage
            clearForm={clearForm}
            onClose={() => {setShowConfirmDialog(false)}}
          />
        ) : null}
    </>
  )
}

const SignInMessage = props => {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-3xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none w-96">
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">
                You must be signed in
              </h3>
              <button
                className="background-transparent p-1 ml-auto border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={(event) => {
                  props.clearForm(event)
                  props.onClose()
                }}
              >
                <span className="text-black opacity-50 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <div className="p-6 flex justify-center">
              <button className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" onClick={() => signIn()}>Please Sign in</button>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={(event) => {
                  props.clearForm(event)
                  props.onClose()
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
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
