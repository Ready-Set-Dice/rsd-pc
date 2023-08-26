<template>
    <div v-if="!!current && !!current.object && current.object.type == 'domain'">
        <div 
            v-if="current.object.description" 
        >
            <div class="px-2">
                <span class="font-weight-bold text-body-1">{{current.object.name}}</span><br />
                <br />
                <span class="font-weight-bold text-body-1">Description</span><br />
            </div>
            <div 
                v-html="$sanitize(current.object.description)" 
                class="alt-scrollbar dialog-description pa-2">
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        current: Object,
    },
}
</script>