<template>
    <div 
        v-if="!!visible"
        class="d-flex flex-column pa-2 view-space"    
    >
        <div class="d-flex flex-row align-center text-uppercase">
            <div class="d-flex flex-column">
                <span class="text-h6 roboto-condensed">Feats Overview</span>
            </div>
        </div>

        <hr />

        <div class="fill-height alt-scrollbar feats-overview" v-show="!!isInitiated" :class="!!rsd.darkmode ? 'theme--dark' : ''">
            <div class="d-flex flex-wrap flex-column">
                <!-- {{allCategories()}} -->
                <div
                    v-for="(feats, category) in allCategories()"
                    :key='"feature-category-"+category'
                >
                    <span class="text-subtitle-1 font-weight-bold text-uppercase primary--text">{{category}} Feats</span>
                    <div
                        v-for="(value, key) in feats"
                        :key='"feature-"+value.name+"-"+key'
                        class="mx-2 flex-inline"
                    >
                        <FeatDescription :feat="value">
                            <template v-slot:after>
                                <div
                                    v-for="(child, ckey) in value._children"
                                    :key='"feature-"+child.name+"-"+ckey'
                                    class="mx-2 flex-inline"
                                >
                                    <FeatDescription :feat="child" />
                                </div>
                            </template>
                        </FeatDescription>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { isGM  } from '@/services'
import FeatDescription from '@/components/FeatDescription'

export default {
    components: {
        FeatDescription,
    },
    data() {
        return {
            initiated: false,
            refreshFeatKey: 0,
            featTimer: null,
            maxFeatTimer: 10,
        }
    },
    props: {
        visible: Boolean,
        localCharacter: Object,
    },
    computed: {
        isInitiated() {
            return !!this.initiated && !this.refresh
        }
    },
    methods: {
        allCategories() {
            const allFeats = this.allFeats()
            let categories = {}
            if (!!allFeats && allFeats.length > 0) {
                let children = []
                allFeats.forEach(af => {
                    if (!!af && !!af.system) {
                        // console.log('af', af.name, af._parentid)
                        const hasParent = !!af._parentid
                        const category = !!af.system.category ? af.system.category : (!!af.type ? af.type : null)
                        const oldCategory = !!category && !!categories[category]
                        if (!!category) {
                            if (!oldCategory && !hasParent) {
                                categories[category] = []
                            }

                            if (!hasParent) {
                                categories[category].push(af)
                            } else {
                                children.push(af)
                            }
                        }
                    }
                })

                if (!!children && children.length > 0) {
                    children.forEach(af => {
                        if (!!af && !!af.system) {
                            let parentIndex = -1
                            let parentCategory = null
                            Object.keys(categories).forEach(cat => {
                                if (!!cat && parentIndex == -1 && !parentCategory) {
                                    const searchIndex = categories[cat].findIndex(p => p._id == af._parentid)
                                    if (searchIndex != -1) {
                                        parentIndex = searchIndex
                                        parentCategory = cat
                                    }
                                }
                            })

                            if (parentIndex != -1 && !!parentCategory) {
                                if (!categories[parentCategory][parentIndex]._children) {
                                    categories[parentCategory][parentIndex]._children = []
                                }
                                
                                if (!!categories[parentCategory][parentIndex]._children && categories[parentCategory][parentIndex]._children.length > 0) {
                                    const searchIndex = categories[parentCategory][parentIndex]._children.findIndex(c => c._id == af._id)
                                    if (searchIndex == -1) {
                                        categories[parentCategory][parentIndex]._children.push(af)
                                    }
                                } else {
                                    categories[parentCategory][parentIndex]._children.push(af)
                                }
                            } else {
                                const category = !!af.system.category ? af.system.category : (!!af.type ? af.type : null)
                                const oldCategory = !!category && !!categories[category]
                                if (!!category) {
                                    if (!oldCategory) {
                                        categories[category] = []
                                    }
                                    categories[category].push(af)
                                }
                            }
                        }
                    })
                }
            }
            return categories
        },
        allFeats() {
            const member = this.$rsd.playercharacters.active
            if (!!member && !!member.level) {
                const feats = this.$rsd.build.getAllFeatureItems(member, member.level, false)
                // console.log('allFeats', feats)
                return feats
            }
            return null
        },
        toggleOpenFeatDescription(index) {
            this.$store.dispatch('rsd/setBuildViewOpen', index)
        },
    },
    mounted() {
        this.featTimer = setInterval(() => {
            this.refreshFeatKey++;

            let nullCheck = true;
            if (!!this.$rsd.playercharacters.active) {
                nullCheck = nullCheck && !!this.$rsd.playercharacters.active.name
                
                nullCheck = nullCheck && !!this.$rsd.playercharacters.active.abc
                nullCheck = nullCheck && !!this.$rsd.playercharacters.active.abc.a
                nullCheck = nullCheck && !!this.$rsd.playercharacters.active.abc.b
                nullCheck = nullCheck && !!this.$rsd.playercharacters.active.abc.c
                if (!!this.$rsd.playercharacters.active.adv) {
                    let hasBuild = !!this.$rsd.playercharacters.active.build
                    nullCheck = nullCheck && !!hasBuild
                    hasBuild = !!this.$rsd.playercharacters.active.build && !!this.$rsd.playercharacters.active.build[1]
                    nullCheck = nullCheck && !!hasBuild
                    nullCheck = nullCheck && !!hasBuild && !!this.$rsd.playercharacters.active.build[1].ab0
                    nullCheck = nullCheck && !!hasBuild && !!this.$rsd.playercharacters.active.build[1].bb0
                    nullCheck = nullCheck && !!hasBuild && !!this.$rsd.playercharacters.active.build[1].cb0
                    nullCheck = nullCheck && !!hasBuild && !!this.$rsd.playercharacters.active.build[1].fb
                    nullCheck = nullCheck && !!hasBuild && !!this.$rsd.playercharacters.active.build[1].sk
                    let hasChoices = !!hasBuild && !!this.$rsd.playercharacters.active.build[1].chc
                    nullCheck = nullCheck && !!hasChoices
                    nullCheck = nullCheck && !!hasChoices && !!this.$rsd.playercharacters.active.build[1].chc.ancestry
                    nullCheck = nullCheck && !!hasChoices && !!this.$rsd.playercharacters.active.build[1].chc.heritage
                    nullCheck = nullCheck && !!hasChoices && !!this.$rsd.playercharacters.active.build[1].chc.heritage
                }
            } else {
                nullCheck = false;
            }

            if (this.refreshFeatKey == this.maxFeatTimer || !!nullCheck) {
                clearInterval(this.featTimer);
                
                setTimeout(() => {
                    this.initiated = true;
                }, 500)
            }
        }, 500);
    }
}
</script>

<style lang="less" scoped>
.feats-overview {
    height: calc(~"100vh - 150px");
    overflow-y: scroll;
    overflow-x: clip;
}
.party-member-card {
    width: 25%;
}
</style>