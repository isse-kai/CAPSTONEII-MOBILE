// supabase/controllers/workerinformationcontroller.ts
import {
  getWorkerAgreementsByAuthUid,
  getWorkerInformationByAuthUid,
  getWorkerRateByAuthUid,
  getWorkerRequiredDocumentsByAuthUid,
  getWorkerWorkInformationByAuthUid,
  saveWorkerAgreements,
  saveWorkerInformation,
  saveWorkerRate,
  saveWorkerRequiredDocuments,
  saveWorkerWorkInformation,
  WorkerAgreementsPayload,
  WorkerInformationPayload,
  WorkerRatePayload,
  WorkerRequiredDocumentsPayload,
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
    throw error
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
    return null
  }
}

/* ───────── Step 3: Required Documents ───────── */

export async function handleGetWorkerRequiredDocuments(authUid: string) {
  try {
    const info = await getWorkerRequiredDocumentsByAuthUid(authUid)
    return info
  } catch (error) {
    console.error("handleGetWorkerRequiredDocuments error:", error)
    return null
  }
}

export async function handleSaveWorkerRequiredDocuments(
  authUid: string,
  payload: WorkerRequiredDocumentsPayload,
) {
  try {
    const saved = await saveWorkerRequiredDocuments(authUid, payload)
    return saved
  } catch (error) {
    console.error("Failed to save worker required documents", error)
    return null
  }
}

/* ───────── Step 4: Service Rate ───────── */

export async function handleGetWorkerRate(authUid: string) {
  try {
    const info = await getWorkerRateByAuthUid(authUid)
    return info
  } catch (error) {
    console.error("handleGetWorkerRate error:", error)
    return null
  }
}

export async function handleSaveWorkerRate(
  authUid: string,
  payload: WorkerRatePayload,
) {
  try {
    const saved = await saveWorkerRate(authUid, payload)
    return saved
  } catch (error) {
    console.error("Failed to save worker rate", error)
    return null
  }
}

/* ───────── Step 5: Terms & Agreements ───────── */

export async function handleGetWorkerAgreements(authUid: string) {
  try {
    const info = await getWorkerAgreementsByAuthUid(authUid)
    return info
  } catch (error) {
    console.error("handleGetWorkerAgreements error:", error)
    return null
  }
}

export async function handleSaveWorkerAgreements(
  authUid: string,
  payload: WorkerAgreementsPayload,
) {
  try {
    const saved = await saveWorkerAgreements(authUid, payload)
    return saved
  } catch (error) {
    console.error("Failed to save worker agreements", error)
    return null
  }
}
