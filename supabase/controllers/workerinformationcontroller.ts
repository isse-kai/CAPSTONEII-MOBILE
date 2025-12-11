// supabase/controllers/workerinformationcontroller.ts
import {
    getWorkerInformationByAuthUid,
    getWorkerWorkInformationByAuthUid,
    saveWorkerInformation,
    saveWorkerWorkInformation,
    WorkerInformationPayload,
    WorkerWorkInformationPayload,
} from "../services/workerinformationservice"

/* ───────── Step 1: Personal Information ───────── */

export async function handleGetWorkerInformation(authUid: string) {
  try {
    const info = await getWorkerInformationByAuthUid(authUid)
    return info
  } catch (error) {
    console.error("handleGetWorkerInformation error:", error)
    return null
  }
}

export async function handleSaveWorkerInformation(
  authUid: string,
  payload: WorkerInformationPayload,
) {
  try {
    const saved = await saveWorkerInformation(authUid, payload)
    return saved
  } catch (error) {
    console.error("Failed to save worker information", error)
    throw error // let the screen show Alert
  }
}

/* ───────── Step 2: Work Information ───────── */

export async function handleGetWorkerWorkInformation(authUid: string) {
  try {
    const info = await getWorkerWorkInformationByAuthUid(authUid)
    return info
  } catch (error) {
    console.error("handleGetWorkerWorkInformation error:", error)
    return null
  }
}

export async function handleSaveWorkerWorkInformation(
  authUid: string,
  payload: WorkerWorkInformationPayload,
) {
  try {
    const saved = await saveWorkerWorkInformation(authUid, payload)
    return saved
  } catch (error) {
    console.error("Failed to save worker work information", error)
    throw error
  }
}
