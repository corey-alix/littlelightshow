import { createClient } from "../globals.js";
import faunadb from "faunadb";

const { query } = faunadb;
const q = query;

export async function validate() {
  createClient();
}
