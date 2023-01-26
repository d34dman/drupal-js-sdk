<template>
	<div class="home">
		<nav>
			<button v-if="user.loggedIn" @click="logout">Log out</button>
			<router-link v-else to="/login">Login</router-link>
		</nav>
		<p>
			You are logged in as {{ user.name }}
		</p>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import drupal from '../utils/drupal-sdk';

export default Vue.extend({
	name: 'Home',
	data() {
		return {
			user: {
				name: '',
				loggedIn: false
			}
		};
	},
	methods: {
		async checkAuthStatus() {
			const status = drupal.loginStatus();
			this.user.loggedIn = Boolean(status);
			this.user.name = localStorage.getItem('username') || '';
		},
		logout() {
			drupal.logout().then(() => {
				this.user.loggedIn = false;
				localStorage.removeItem('username');
				this.$router.push('/login');
			});
		}
	},
	async mounted() {
		console.log(drupal);
		await this.checkAuthStatus();
		if (!this.user.loggedIn) {
			this.$router.push('/login');
		}
	}
});
</script>
