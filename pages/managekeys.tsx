import type { NextPage } from 'next'
import { exportKey, getKeyNames, getPrivKey } from '../utils/encrypt'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { checkSession } from '../utils/supabase'
import { Headers } from '../components/headers'
import Navigation from '../components/navigation'

type KeyValues = {
    [key: string]: boolean
}

const ListKeysComponent = () => {
    const router = useRouter()
    const [showKeys, setShowKeys] = useState<KeyValues>({})
    const [keys, setKeys] = useState<string[][]>([])
    const showKey = (name: string) => {
        let newKeys = {...showKeys}
        newKeys[name] = true
        setShowKeys(newKeys)
    }
    const hideKey = (name: string) => {
        let newKeys = {...showKeys}
        newKeys[name] = false
        setShowKeys(newKeys)
    }
    const readKeyNames = async () => {
        console.log("Getting key names")
        if (!router.isReady) return
        const names = await getKeyNames()
        console.log(`Found ${names.length} keys`)
        const namesAndValues = await Promise.all(
            names.map(async (name) => [name, await exportKey(name)])
        )
        setKeys(namesAndValues)
        setShowKeys(Object.fromEntries(names.map((name) => [name, false])))
    }
    useEffect(
        () => { readKeyNames().catch(console.error) },
        [router.isReady]
    )
    return <div
        role="listitem"
        className="w-dyn-item w-col w-col-10"
    >
        <h3>Currently Stored Keys (Browser)</h3>
        <table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Key</th>
            </tr>
            </thead>
            <tbody>
            {keys.map(([name, value]) => <tr key={name}>
                <td>{name}</td>
                <td>{showKeys[name]
                    ?
                    <>{value} <a href="#" onClick={e => hideKey(name)}>(hide)</a></>
                    :
                    <a href="#" onClick={e => showKey(name)}>(show)</a>}
                </td>
            </tr>)}
            </tbody>
        </table>
    </div>
}

const GenerateKeysComponents = () => {
    return <div role="listitem" className="w-dyn-item w-col w-col-4">
        <h3>Create a New Key</h3>
        <label htmlFor="keyName">Key Name</label>
        <input
            type="text"
            name="keyName"
            id="keyName"
            className="w-input"
        />
        <button className="w-button">Generate</button>
    </div>
}


const ManageKeysPage: NextPage = () => {
    const [session, setSession] = checkSession()
    return <>
        <Headers title="Kestrel Photos: Account"/>
        <Navigation session={session} setSession={setSession}/>
        <div className="section wf-section">
            <div className="w-container">
                <div className="w-dyn-list">
                    <div role="list" className="w-dyn-items w-row">
                        <ListKeysComponent/>
                        <GenerateKeysComponents/>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default ManageKeysPage
