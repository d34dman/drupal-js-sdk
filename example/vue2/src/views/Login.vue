<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-md w-full space-y-8">
			<div>
				<img
					class="mx-auto h-12 w-auto"
					src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
					alt="Workflow"
				/>
				<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Sign in to your account
				</h2>
			</div>
			<ErrorAlert v-if="error" :error="error" />
			<LoginForm />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import ErrorAlert from '../components/ErrorAlert.vue';
import LoginForm from '../components/LoginForm.vue';

export default Vue.extend({
	components: {
		ErrorAlert,
		LoginForm
	},
	data() {
		return {
			error: ''
		};
	}
});
</script>
