<template>
    <button @click="myMethod">Click Me</button>
</template>

<script>
export default {
    methods: {
        myMethod() {
            console.log("Method called");
        }
    }
}
</script>