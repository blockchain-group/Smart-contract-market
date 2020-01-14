import {FETCH_ACCOUNTS} from "./types";

export const fetchAccounts = (accounts) => ({
	type: FETCH_ACCOUNTS,
	accounts
});