<template>
    <div v-if="!!current && !!current.object && current.object.type == 'deity'">
        <div 
            v-if="current.object.description" 
        >
            <div class="px-2">
                <span class="font-weight-bold text-body-1">Devotee Benefits</span><br />
                <span class="font-weight-bold">Ability</span> <span class="text-capitalize">
                    <span v-for="(item, index) in current.object.ability" :key="'ability-'+item">{{$rsd.format.abilityBeautify(item)}}{{index != current.object.ability.length -1 ? ', ' : ''}}</span>
                </span><br />
                <span class="font-weight-bold">Category</span> <span class="text-capitalize">{{current.object.category}}</span><br />
                <span class="font-weight-bold">Domains</span> <span class="text-capitalize">
                    <ul>
                        <li v-if="!!current.object.domains.primary && current.object.domains.primary.length > 0">
                            <span>Primary: </span>
                            <span v-for="(item, index) in current.object.domains.primary" :key="'domain-'+item">{{item}}{{index != current.object.domains.primary.length -1 ? ', ' : ''}}</span>
                        </li>
                        <li v-if="!!current.object.domains.alternate && current.object.domains.alternate.length > 0">
                            <span>Alternate: </span>
                            <span v-for="(item, index) in current.object.domains.alternate" :key="'domain-'+item">{{item}}{{index != current.object.domains.alternate.length -1 ? ', ' : ''}}</span>
                        </li>
                    </ul>
                </span>
                <span class="font-weight-bold">Font</span> <span class="text-capitalize">
                    <span v-for="(item, index) in current.object.font" :key="'ability-'+item">{{item}}{{index != current.object.font.length -1 ? ', ' : ''}}</span>    
                </span><br />
                <span class="font-weight-bold">Spells</span> <span class="text-capitalize">
                    <ul>
                        <li v-for="(item, index) in current.object.spells" :key="'spell-'+index">
                            <span>Level {{index}} - </span>
                            <span>{{$rsd.build.getFeatByString(item).name}}</span>
                        </li>
                    </ul>
                </span>
                <span class="font-weight-bold">Weapons</span> <span class="text-capitalize">
                    <span v-for="(item, index) in current.object.weapons" :key="'ability-'+item">{{item}}{{index != current.object.weapons.length -1 ? ', ' : ''}}</span>    
                </span><br />
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