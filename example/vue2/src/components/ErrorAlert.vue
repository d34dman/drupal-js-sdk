<template functional>
	<div
		class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
		role="alert"
	>
		<strong class="font-bold">Holy smokes!</strong>
		<span class="block sm:inline">{{ props.error }}</span>
	</div>
</template>
