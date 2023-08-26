<template>
    <div v-if="!!current && !!current.object && current.object.type == 'classfeature'">
        <div 
            v-if="current.object.description" 
        >
            <div class="px-2">
                <span class="font-weight-bold text-body-1">Class Feature</span><br />
                <span class="font-weight-bold">Level</span> <span class="text-capitalize">{{current.object.level.value}}</span><br/>
                <span v-if="!!current.object.prerequisites && current.object.prerequisites.length > 0">
                    <span class="font-weight-bold">Prerequisites</span> <span class="text-capitalize">{{current.object.prerequisites}}</span>
                </span><br/>

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