/**
* This configuration file lets you run `$ sanity [command]` in this folder
* Go to https://www.sanity.io/docs/cli to learn more.
**/
import { defineCliConfig } from 'sanity/cli'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
	api: { projectId, dataset },
	vite: {
		define: {
			'process.env.NEXT_PUBLIC_SANITY_PROJECT_ID': JSON.stringify(projectId),
			'process.env.NEXT_PUBLIC_SANITY_DATASET': JSON.stringify(dataset),
			'process.env.NEXT_PUBLIC_SANITY_API_VERSION': JSON.stringify(
				process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-10-16'
			),
		},
	},
})
