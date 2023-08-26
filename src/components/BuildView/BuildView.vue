<template>
    <div 
        class="d-flex flex-column pa-2 view-space"    
    >
        <div class="d-flex flex-row align-center text-uppercase">
            <div class="d-flex flex-column">
                <span 
                    class="text-h6 roboto-condensed"
                    v-show="gameView.build == 0"
                >Base Setup</span>
                <span 
                    class="text-h6 roboto-condensed"
                    v-show="!!gameView.build && gameView.build > 0"
                >Level {{ gameView.build }}</span>
            </div>
            <v-spacer></v-spacer>
            <div 
                class="text-h6" 
                v-if="!!$rsd.playercharacters.active && $rsd.playercharacters.active.level < gameView.build"
            >
                <span>Above current level</span>
            </div>
        </div>

        <hr />

        <div class="fill-height party-overview alt-scrollbar" :class="!!rsd.darkmode ? 'theme--dark' : ''">
            <div class="d-flex flex-column" v-if="!!$rsd.playercharacters.active">
                <div class="flex-column flex-wrap" :class="gameView.build == 0 ? 'd-flex' : 'd-none'">
                    <span class="reverse-switch">
                        <v-switch
                            v-show="!!isInitiated"
                            class="mt-0 secondary--text"
                            hide-details
                            inset
                            dense
                            readonly
                            @click="clickAdvancedSwitch"
                            :label="`Advanced character:`"
                            :input-value="$rsd.playercharacters.active.adv"
                            :value="$rsd.playercharacters.active.adv"
                        ></v-switch>
                        <v-skeleton-loader
                            v-show="!isInitiated"
                            class="mt-2"
                            max-width="200"
                            height="20"
                            type="text"
                        ></v-skeleton-loader>
                    </span>

                    <span class="red--text font-weight-black">{{ !!$rsd.playercharacters.active.adv ? 'Advanced player setup is currently under development. Use at risk of loss, and assume it is not fully implemented.' : '' }}</span>

                    <hr />

                    <FeatCard
                        :initiated="isInitiated"
                        :clickFunction="openAncestryDialog"
                        icon="family-tree"
                        :subject="$rsd.playercharacters.active.ancestryObj"
                        type="Ancestry"
                    ></FeatCard>
                    <FeatCard
                        :initiated="isInitiated"
                        :clickFunction="openBackgroundDialog"
                        icon="scroll-quill"
                        :subject="$rsd.playercharacters.active.backgroundObj"
                        type="Background"
                    ></FeatCard>
                    <FeatCard
                        :initiated="isInitiated"
                        :clickFunction="openClassDialog"
                        icon="winged-sword"
                        :subject="$rsd.playercharacters.active.classObj"
                        type="Class"
                    ></FeatCard>

                    <hr class="my-2" />

                    <div class="flex-row flex-wrap" :class="!$rsd.playercharacters.active.adv ? 'd-flex' : 'd-none'">
                        <v-btn class="my-1" @click="openEditBasicPCStatsDialog($rsd.playercharacters.active)">Change Stats</v-btn>
                        <v-btn class="my-1 mx-2" @click="openEditBasicPCSkillsDialog($rsd.playercharacters.active)">Change Skills</v-btn>
                    </div>
                    <div class="flex-row flex-wrap" :class="!!$rsd.playercharacters.active.adv ? 'd-flex' : 'd-none'">
                        <!-- <v-btn class="my-1" @click="openBoostsDialog($rsd.playercharacters.active, 1)">Starting Boosts</v-btn> -->
                        <!-- <v-btn class="my-1 mx-2">Skill Training</v-btn> -->
                        <!-- <v-btn class="my-1">Class Skill</v-btn> -->
                    </div>
                    
                    <hr class="my-2" :class="!$rsd.playercharacters.active.adv ? 'd-flex' : 'd-none'" />

                    <div class="d-flex flex-column">
                        <span>Age: <v-btn outlined x-small tile @click="openPCDetailDialog($rsd.playercharacters.active, 'age')">{{getPCDetail($rsd.playercharacters.active, 'age')}}</v-btn></span>
                        <span>Gender: <v-btn outlined x-small tile @click="openPCDetailDialog($rsd.playercharacters.active, 'gender')">{{getPCDetail($rsd.playercharacters.active, 'gender')}}</v-btn></span>
                        <div>
                            <span>Languages:</span>
                            <ul v-if="!!$rsd.playercharacters.active && !!$rsd.playercharacters.active.ancestryObj && !!$rsd.playercharacters.active.ancestryObj.system">
                                <li v-for="language in $rsd.playercharacters.active.ancestryObj.system.languages.value" :key="'language-'+language">{{language}}</li>
                            </ul>
                            <span v-else>None</span>
                        </div>
                        <div>
                            <span>Additional languages: </span>
                            <span v-if="!!$rsd.playercharacters.active">
                                {{getAdditionalLanguages($rsd.playercharacters.active)}}
                            </span>
                            <span v-else>None</span><br/>
                            <v-btn outlined x-small tile>Unset</v-btn>
                        </div>
                    </div>
                </div>
                <div class="flex-column view-space flex-wrap" :class="gameView.build != 0 ? 'd-flex' : 'd-none'">
                    <div :class="!!gameView.build && gameView.build > 0 ? 'd-flex' : 'd-none'">
                        <v-btn 
                            v-if="isBoostIncreaseLevel($rsd.playercharacters.active,  gameView.build)" 
                            class="ma-1 icon-button" 
                            @click="openBoostsDialog($rsd.playercharacters.active, gameView.build)"
                            tile
                            elevation="3"
                        >
                            <div class="d-flex flex-column align-center">
                                <span 
                                    class="gi-icon gi-icon-big icon_color"
                                    :style="GameIcons.get.icon('skills')"  
                                ></span>
                                <span class="font-weight-light text-caption">Set Abilities 
                                    (<span v-show="!isInitiated" class="skeleton-text-fix"><v-skeleton-loader max-width="6" height="14" type="text"></v-skeleton-loader></span><span v-show="!!isInitiated">{{ getRemainingBoosts($rsd.playercharacters.active, gameView.build) }}</span>)</span>
                            </div>
                        </v-btn>
                        <v-btn 
                            v-if="isSkillIncreaseLevel($rsd.playercharacters.active, gameView.build)" 
                            class="ma-1 icon-button" 
                            @click="openSkillsDialog($rsd.playercharacters.active, gameView.build)"
                            tile
                            elevation="3"
                        >
                            <div class="d-flex flex-column align-center">
                                <span 
                                    class="gi-icon gi-icon-big icon_color"
                                    :style="GameIcons.get.icon('weight-lifting-up')"  
                                ></span>
                                <span class="font-weight-light text-caption">Skill Training
                                    (<span v-show="!isInitiated" class="skeleton-text-fix"><v-skeleton-loader max-width="6" height="14" type="text"></v-skeleton-loader></span><span v-show="!!isInitiated">{{ getRemainingSkills($rsd.playercharacters.active, gameView.build) }}</span>)
                                </span>
                            </div>
                        </v-btn>
                    </div>
                </div>
                <div class="flex-column flex-wrap" :class="gameView.build != 0 ? 'd-flex' : 'd-none'">
                    <FeatCard
                        v-if="gameView.build == 1"
                        :clickFunction="() => {openHeritageChoiceDialog($rsd.playercharacters.active, gameView.build)}"
                        icon="family-tree"
                        :initiated="isInitiated"
                        :subject="getABCChoiceValue($rsd.playercharacters.active, gameView.build, 'heritage')"
                        type="Heritage"
                    ></FeatCard>
                    <FeatCard
                        v-if="isAncestryFeatLevel($rsd.playercharacters.active, gameView.build)"
                        :clickFunction="() => {openAncestryFeatChoiceDialog($rsd.playercharacters.active, gameView.build)}"
                        :error="hasPrerequisitesMet($rsd.playercharacters.active, gameView.build, 'ancestry')"
                        icon="family-tree"
                        :initiated="isInitiated"
                        :subject="getABCChoiceValue($rsd.playercharacters.active, gameView.build, 'ancestry')"
                        type="Ancestry Feat"
                    ></FeatCard>
                    <FeatCard
                        v-if="isClassFeatLevel($rsd.playercharacters.active, gameView.build)"
                        :clickFunction="() => {openClassFeatChoiceDialog($rsd.playercharacters.active, gameView.build)}"
                        :error="hasPrerequisitesMet($rsd.playercharacters.active, gameView.build, 'class')"
                        icon="winged-sword"
                        :initiated="isInitiated"
                        :subject="getABCChoiceValue($rsd.playercharacters.active, gameView.build, 'class')"
                        type="Class Feat"
                    ></FeatCard>
                    <FeatCard
                        v-if="isGeneralFeatLevel($rsd.playercharacters.active, gameView.build)"
                        :clickFunction="() => {openGeneralFeatChoiceDialog($rsd.playercharacters.active, gameView.build)}"
                        :error="hasPrerequisitesMet($rsd.playercharacters.active, gameView.build, 'general')"
                        icon="mesh-ball"
                        :initiated="isInitiated"
                        :subject="getABCChoiceValue($rsd.playercharacters.active, gameView.build, 'general')"
                        type="General Feat"
                    ></FeatCard>
                    <FeatCard
                        v-if="isSkillFeatLevel($rsd.playercharacters.active, gameView.build)"
                        :clickFunction="() => {openSkillFeatChoiceDialog($rsd.playercharacters.active, gameView.build)}"
                        :error="hasPrerequisitesMet($rsd.playercharacters.active, gameView.build, 'skill')"
                        icon="artificial-intelligence"
                        :initiated="isInitiated"
                        :subject="getABCChoiceValue($rsd.playercharacters.active, gameView.build, 'skill')"
                        type="Skill Feat"
                    ></FeatCard>
                </div>
                <div class="flex-column view-space flex-wrap" :class="gameView.build != 0 ? 'd-flex' : 'd-none'" v-show="!isInitiated">
                    <v-skeleton-loader
                        v-show="!isInitiated"
                        class="mt-2"
                        max-width="200"
                        type="divider"
                    ></v-skeleton-loader>
                </div>
                <div class="flex-column view-space flex-wrap" :class="gameView.build != 0 ? 'd-flex' : 'd-none'" v-show="!!isInitiated">
                    <div
                        v-for="(value, key) in getClassItems($rsd.playercharacters.active, gameView.build)"
                        :key='"class-feature-"+key'
                    >   
                        <FeatDescription :feat="value">
                            <template v-slot:after>
                                <FeatCard
                                    v-if="hasChoice(value)"
                                    class="mr-8"
                                    :clickFunction="() => {openSimpleChoiceDialog($rsd.playercharacters.active, gameView.build, value)}"
                                    :initiated="isInitiated"
                                    :subject="getChoiceValue($rsd.playercharacters.active, gameView.build, value)"
                                    :type="value.name"
                                ></FeatCard>
                            </template>
                        </FeatDescription>
                    </div>
                </div>
            </div>
        </div>

        <BasicPCSkillsDialog ref="basicPCSkillsDialog" />
        <BasicPCStatsDialog ref="basicPCStatsDialog" />

        <AncestryDialog ref="ancestryDialog" />
        <BackgroundDialog ref="backgroundDialog" />
        <ClassDialog ref="classDialog" />
        <PCDetailDialog ref="pcDetailDialog" />

        <BoostsDialog ref="boostsDialog" />
        <StartingBoostsDialog ref="startingBoostsDialog" />
        <SkillsDialog ref="skillsDialog" />

        <AncestryFeatChoiceDialog ref="ancestryFeatChoiceDialog" />
        <ClassFeatChoiceDialog ref="classFeatChoiceDialog" />
        <GeneralFeatChoiceDialog ref="generalFeatChoiceDialog" />
        <HeritageChoiceDialog ref="heritageChoiceDialog" />
        <SimpleChoiceDialog ref="simpleChoiceDialog" />
        <SkillFeatChoiceDialog ref="skillFeatChoiceDialog" />

    </div>
</template>

<script>
import BasicPCSkillsDialog from './components/BasicPCSkillsDialog'
import BasicPCStatsDialog from './components/BasicPCStatsDialog'

import AncestryDialog from './components/AncestryDialog/AncestryDialog'
import AncestryFeatChoiceDialog from './components/AncestryFeatChoiceDialog/AncestryFeatChoiceDialog'
import BackgroundDialog from './components/BackgroundDialog/BackgroundDialog'
import ClassDialog from './components/ClassDialog/ClassDialog'
import ClassFeatChoiceDialog from './components/ClassFeatChoiceDialog/ClassFeatChoiceDialog'
import GeneralFeatChoiceDialog from './components/GeneralFeatChoiceDialog/GeneralFeatChoiceDialog'
import HeritageChoiceDialog from './components/HeritageChoiceDialog/HeritageChoiceDialog'
import PCDetailDialog from './components/PCDetailDialog'
import SimpleChoiceDialog from './components/SimpleChoiceDialog/SimpleChoiceDialog'
import SkillFeatChoiceDialog from './components/SkillFeatChoiceDialog/SkillFeatChoiceDialog'

import BoostsDialog from './components/BoostsDialog'
import FeatCard from '@/components/FeatCard'
import FeatDescription from '@/components/FeatDescription'
import SkillsDialog from './components/SkillsDialog'
import StartingBoostsDialog from './components/StartingBoostsDialog'

export default {
    components: {
        AncestryDialog,
        AncestryFeatChoiceDialog,
        BackgroundDialog,
        BasicPCSkillsDialog,
        BasicPCStatsDialog,
        BoostsDialog,
        ClassDialog,
        ClassFeatChoiceDialog,
        FeatCard,
        FeatDescription,
        GeneralFeatChoiceDialog,
        HeritageChoiceDialog,
        PCDetailDialog,
        SimpleChoiceDialog,
        SkillFeatChoiceDialog,
        SkillsDialog,
        StartingBoostsDialog,
    },
    data() {
        return {
            initiated: false,
            refreshBuildKey: 0,
            buildTimer: null,
            maxBuildTimer: 10,
        }
    },
    computed: {
        isInitiated() {
            return !!this.initiated && !this.refresh
        }
    },
    methods: {
        clickAdvancedSwitch(event) {
            this.$rsd.dialog.open({
                name: "confirmDialog",
                attrs: [
                    "Switch advanced",
                    `Are you sure you want to switch? This will reset your character!`,
                    () => {
                        this.confirmToggleAdvanced();
                    },
                ],
            });
        },
        confirmToggleAdvanced() {
            this.$rsd.playercharacters.updateStats(this.$rsd.playercharacters.activeKey, {adv: !this.$rsd.playercharacters.active.adv})
        },

        isAncestryFeatLevel(member, level) {
            if (!!member && !!level) {
                if (!!member && !!member.classObj && !!member.classObj.system && !!member.classObj.system.ancestryFeatLevels && !!member.classObj.system.ancestryFeatLevels.value) {
                    return member.classObj.system.ancestryFeatLevels.value.includes(level)
                }
            }
        },
        isBoostIncreaseLevel(member, level) {
            if (!!member && !!level) {
                return level == 1 || level % 5 == 0
            }
        },
        isClassFeatLevel(member, level) {
            if (!!member && !!level) {
                if (!!member && !!member.classObj && !!member.classObj.system && !!member.classObj.system.classFeatLevels && !!member.classObj.system.classFeatLevels.value) {
                    return member.classObj.system.classFeatLevels.value.includes(level)
                }
            }
        },
        isGeneralFeatLevel(member, level) {
            if (!!member && !!level) {
                if (!!member && !!member.classObj && !!member.classObj.system && !!member.classObj.system.generalFeatLevels && !!member.classObj.system.generalFeatLevels.value) {
                    return member.classObj.system.generalFeatLevels.value.includes(level)
                }
            }
        },
        isSkillIncreaseLevel(member, level) {
            if (!!member && !!level) {
                if (level == 1) { return true }
                else if (!!member && !!member.classObj && !!member.classObj.system && !!member.classObj.system.skillIncreaseLevels && !!member.classObj.system.skillIncreaseLevels.value) {
                    return member.classObj.system.skillIncreaseLevels.value.includes(level)
                }
            }
        },
        isSkillFeatLevel(member, level) {
            if (!!member && !!level) {
                if (!!member && !!member.classObj && !!member.classObj.system && !!member.classObj.system.skillFeatLevels && !!member.classObj.system.skillFeatLevels.value) {
                    return member.classObj.system.skillFeatLevels.value.includes(level)
                }
            }
        },
        getRemainingBoosts(member, level) {
            if (!!member && !!level) {
                return !!member.build && !!member.build[level] && !!member.build[level].fb ? 4 - member.build[level].fb.length : 4
            }
        },
        getRemainingSkills(member, level) {
            if (!!member && !!level) {
                const levelBuild = !!member.build && !!member.build[level] ? member.build[level] : null
                const skill_count = !!levelBuild && !!levelBuild.sk ? levelBuild.sk.length : 0

                const scores_array = this.$rsd.playercharacters.getScoreArrayLevel(member.id, level)
                const cExtraSkills = !!member.classObj && !!member.classObj.system && !!member.classObj.system && !!member.classObj.system.trainedSkills && !!member.classObj.system.trainedSkills.value ? member.classObj.system.trainedSkills.additional : 0
                const intMod = ((scores_array[this.$rsd.format.scoreIndexes['int']]-10)/2)

                const numOfSkills = level == 1 ? cExtraSkills + intMod - skill_count : 1 - skill_count

                return numOfSkills
            }
        },
        getAdditionalLanguages(member) {
            if (!!member && !!member.level) {
                const scores_array = this.$rsd.playercharacters.getScoreArrayLevel(member.id, member.level)

                const abcItem = !!member.abc && !!member.abc.a ? this.$rsd.build.getAncestry(member.abc.a) : null
                const abcObj = !!abcItem ? this.$rsd.build.getAncestryObject(abcItem) : null

                const intMod = ((scores_array[this.$rsd.format.scoreIndexes['int']]-10)/2)

                const numOfSkills = !!abcObj ? abcObj.additionalLanguages.count + intMod : intMod

                return numOfSkills
            }
        },
        getPCDetail(member, detail) {
            let returnDetail = 'Unset'
            if (!!member && !!member.dtl && !!detail) {
                returnDetail = !!member.dtl[detail[0]] ? member.dtl[detail[0]] : 'Unset'
            }
            return returnDetail    
        },
        
        getClassItems(member, level) {
            return this.$rsd.build.getAllFeatureItems(member, level)
        },

        getABCChoiceValue(member, level, abc) {
            if (!!member && !!level && !!abc) {
                if (!!member.build && !!member.build[level] && !!member.build[level].chc && !!member.build[level].chc[abc]) {
                    const choice = member.build[level].chc[abc]
                    let choiceFeature = null
                    if (abc == 'heritage') {
                        choiceFeature = this.$rsd.build.getHeritage(choice.val)
                    } else {
                        choiceFeature = this.$rsd.build.getFeat(choice.val)
                        if (!!choiceFeature) {
                            choiceFeature = this.$rsd.build.getFeatObject(choiceFeature)
                        }
                    }
                    

                    return choiceFeature
                }
            }
        },
        getChoiceValue(member, level, feature) {
            if (!!member && !!level && !!feature && !!feature._id) {
                if (!!member.build && !!member.build[level] && !!member.build[level].chc && !!member.build[level].chc[feature._id]) {
                    const choice = member.build[level].chc[feature._id]
                    const choiceString = choice.type + '.' + choice.val
                    const choiceFeature = this.$rsd.build.getFeatByString(choiceString)

                    // console.log(choice, choiceString, choiceFeature)

                    return choiceFeature
                }
            }
        },
        getChoiceSet(feature) {
            if (!!this.hasChoice(feature)) {
                if (!!feature.system.rules && feature.system.rules.length > 0) {
                    return feature.system.rules.find(f => f.key == 'ChoiceSet')
                } else {
                    // Requires extra attention
                    return null
                }
            } else {
                return null
            }
        },
        hasChoice(feature) {
            if (!!feature && !!feature.name) {
                if (!!feature && !!feature.system && !!feature.system.rules && feature.system.rules.length > 0) {
                    let choice = feature.system.rules.findIndex(f => f.key == 'ChoiceSet')
                    return choice != -1
                }
            }
            return false
        },
        hasPrerequisitesMet(member, level, abc) {
            if (!!member && !!level && !!abc) {
                const abcItem = this.$rsd.build.getAncestry(member.abc.a)

                if (!!abcItem) {
                    let prerequisites = this.$rsd.build.getPrerequisites(member, level)
                    const skillExpertise = this.$rsd.build.getSkillExpertise(member, level)
                    prerequisites = prerequisites.concat(skillExpertise)

                    if (abc == 'class'){
                        // console.log('prerequisites', prerequisites)
                    }

                    const choice = this.getABCChoiceValue(member, level, abc)

                    if (!!choice && !!choice.system && !!choice.system.prerequisites && !!choice.system.prerequisites.value) {
                        let prerequisitesFulfilled = true && (!choice.system.level || (!!choice.system.level && !!choice.system.level.value && choice.system.level.value <= level))

                        if (choice.system.prerequisites.value.length > 0) {
                            choice.system.prerequisites.value.forEach(req => {
                                if (!!req && !!req.value && !!prerequisitesFulfilled) {
                                    let reqFulfilled = false
                                    prerequisites.forEach(pre => {
                                        if (!!pre) {
                                            reqFulfilled = reqFulfilled || req.value.toLowerCase().includes(pre)
                                        }
                                    })
                                    
                                    prerequisitesFulfilled = prerequisitesFulfilled && reqFulfilled
                                }
                            })
                        }

                        return !prerequisitesFulfilled
                    }
                }
            }
        },

        toggleOpenFeatDescription(index) {
            this.$store.dispatch('rsd/setBuildViewOpen', index)
        },

        openAncestryDialog() {
            this.getDialog('ancestryDialog').show(true, {...this.$rsd.playercharacters.active})
        },
        openBackgroundDialog() {
            this.getDialog('backgroundDialog').show(true, {...this.$rsd.playercharacters.active})
        },
        openClassDialog() {
            this.getDialog('classDialog').show(true, {...this.$rsd.playercharacters.active})
        },

        openEditBasicPCSkillsDialog(member) {
            const stats = this.$rsd.members.getStats(member, true)

            this.getDialog('basicPCSkillsDialog').show(true, {name: member.name, id:member.id, ...stats})
        },
        openEditBasicPCStatsDialog(member) {
            const stats = this.$rsd.members.getStats(member, true)

            this.getDialog('basicPCStatsDialog').show(true, {name: member.name, id:member.id, ...stats})
        },

        openBoostsDialog(member, level) {
            if (!!member && !!level) {
                const levelBuild = !!member.build && !!member.build[level] ? member.build[level] : null
                if (level == 1) {
                    const boostTemplate = this.$rsd.build.getBoostsObject(member.ancestryObj, member.backgroundObj, member.classObj)
                    const scores = [10,10,10,10,10,10]
                    this.getDialog('startingBoostsDialog').show(true, {id: member.id, level: level, ...levelBuild}, {scores: scores, boostTemplate: boostTemplate, aName: member.ancestryObj.name, bName: member.backgroundObj.name, cName: member.classObj.name, })
                } else {
                    const scores = this.$rsd.playercharacters.getScoreArrayLevel(member.id, level - 1)
                    this.getDialog('boostsDialog').show(true, {id: member.id, level: level, ...levelBuild}, {scores: scores})
                }
            }
        },

        openPCDetailDialog(member, detail) {
            if (!!member && !!detail) {
                let detailValue = !!member.dtl && !!member.dtl[detail[0]] ? member.dtl[detail[0]] : null
                this.getDialog('pcDetailDialog').show(true, {id: member.id, detailType: detail, detail: detailValue})
            }
        },

        openSkillsDialog(member, level) {
            /*
                Note on skill increases
                You can always make something trained from untrained
                You can make a skill expert from trained starting from level 3
                You can make a skill master from expert starting from level 7
                You can make a skill legendary from master starting from level 15

                Number of skills you can choose:
                Level 1: might get a default skill from a background, default from class, and a number of additional based on class and int modifier
                Above 1: 1 per specific level
            */
            // console.log('member', member)
            if (!!member && !!level) {
                const levelBuild = !!member.build && !!member.build[level] ? member.build[level] : null

                let profnolevel = !!this.$rsd.settings.getActiveSettings() && !!this.$rsd.settings.getActiveSettings().profnolevel ? level : 0
                if (!profnolevel) {profnolevel = 0}

                if (level > 1) {
                    const numOfSkills = 1

                    const scores = this.$rsd.playercharacters.getScoreArrayLevel(member.id, level)
                    const skills = this.$rsd.playercharacters.getSkillsArrayLevel(member.id, level - 1)

                    // console.log('skills', skills)
                    this.getDialog('skillsDialog').show(true, {id: member.id, level: level, ...levelBuild}, {scores: scores, count: numOfSkills, template: skills, profnolevel: profnolevel})
                } else if (level == 1) {
                    const bSkills = !!member.backgroundObj && !!member.backgroundObj.system && !!member.backgroundObj.system && !!member.backgroundObj.system.trainedSkills && !!member.backgroundObj.system.trainedSkills.value ? member.backgroundObj.system.trainedSkills.value : []
                    const cSkills = !!member.classObj && !!member.classObj.system && !!member.classObj.system && !!member.classObj.system.trainedSkills && !!member.classObj.system.trainedSkills.value ? member.classObj.system.trainedSkills.value : []

                    const numOfSkills = this.getRemainingSkills(member, level)

                    let predefinedSkills = bSkills
                    predefinedSkills = predefinedSkills.concat(cSkills)

                    const scores = this.$rsd.playercharacters.getScoreArrayLevel(member.id, level)
                    this.getDialog('skillsDialog').show(true, {id: member.id, level: level, ...levelBuild}, {scores: scores, template: predefinedSkills, count: numOfSkills, profnolevel: profnolevel})
                }
            }
        },

        openChoiceDialog(member, level, type, extra = null) {
            if (!!member && !!level && !!type) {
                const levelBuild = !!member.build && !!member.build[level] ? member.build[level] : null
                
                let trait = null
                if (!!extra) {
                    let abcItem = null
                    if (member.abc.a == extra) {
                        abcItem = this.$rsd.build.getAncestry(extra)
                    } else if (member.abc.c == extra) {
                        abcItem = this.$rsd.build.getClass(extra)
                    }

                    if (!!abcItem) {
                        trait = abcItem.name
                    }
                }
                const choices = this.$rsd.build.getFeatChoices(type, trait)

                // console.log(choices)
            }
        },

        openAncestryFeatChoiceDialog(member, level) {
            if (!!member && !!member.abc && !!member.abc.a && !!level) {
                const levelBuild = !!member.build && !!member.build[level] ? member.build[level] : null
                const abcItem = this.$rsd.build.getAncestry(member.abc.a)
                
                if (!!abcItem) {
                    let prerequisites = this.$rsd.build.getPrerequisites(member, level)
                    const skillExpertise = this.$rsd.build.getSkillExpertise(member, level)
                    prerequisites = prerequisites.concat(skillExpertise)

                    const choices = this.$rsd.build.getAncestryFeatChoices(abcItem.name, prerequisites)

                    this.getDialog('ancestryFeatChoiceDialog').show(true, 
                        {id: member.id, level: level, ...levelBuild}, 
                        {
                            abc: member.abc,
                            items: choices,
                        }
                    )
                }
            }
        },

        openClassFeatChoiceDialog(member, level) {
            if (!!member && !!member.abc && !!member.abc.c && !!level) {
                const levelBuild = !!member.build && !!member.build[level] ? member.build[level] : null
                const abcItem = this.$rsd.build.getClass(member.abc.c)

                if (!!abcItem) {
                    let prerequisites = this.$rsd.build.getPrerequisites(member, level)
                    const skillExpertise = this.$rsd.build.getSkillExpertise(member, level)
                    prerequisites = prerequisites.concat(skillExpertise)

                    // console.log('prerequisites', prerequisites)

                    const choices = this.$rsd.build.getClassFeatChoices(abcItem.name, prerequisites)

                    this.getDialog('classFeatChoiceDialog').show(true, 
                        {id: member.id, level: level, ...levelBuild}, 
                        {
                            abc: member.abc,
                            items: choices,
                        }
                    )
                }
            }
        },

        openGeneralFeatChoiceDialog(member, level) {
            if (!!member && !!level) {
                const levelBuild = !!member.build && !!member.build[level] ? member.build[level] : null

                let prerequisites = this.$rsd.build.getPrerequisites(member, level)
                const skillExpertise = this.$rsd.build.getSkillExpertise(member, level)
                prerequisites = prerequisites.concat(skillExpertise)

                const choices = this.$rsd.build.getGeneralFeatChoices(prerequisites)

                this.getDialog('generalFeatChoiceDialog').show(true, 
                    {id: member.id, level: level, ...levelBuild}, 
                    {
                        items: choices,
                    }
                )
            }
        },

        openHeritageChoiceDialog(member, level) {
            if (!!member && !!member.abc && !!member.abc.a && !!level) {
                const levelBuild = !!member.build && !!member.build[level] ? member.build[level] : null
                const abcItem = this.$rsd.build.getAncestry(member.abc.a)

                if (!!abcItem) {
                    const choices = this.$rsd.build.getHeritageChoices(abcItem.name)

                    this.getDialog('heritageChoiceDialog').show(true, 
                        {id: member.id, level: level, ...levelBuild}, 
                        {
                            abc: member.abc,
                            items: choices,
                        }
                    )
                }
            }
        },

        openSkillFeatChoiceDialog(member, level) {
            if (!!member && !!level) {
                const levelBuild = !!member.build && !!member.build[level] ? member.build[level] : null

                let prerequisites = this.$rsd.build.getPrerequisites(member, level)
                const skillExpertise = this.$rsd.build.getSkillExpertise(member, level)
                prerequisites = prerequisites.concat(skillExpertise)

                const choices = this.$rsd.build.getSkillFeatChoices(prerequisites)

                this.getDialog('skillFeatChoiceDialog').show(true, 
                    {id: member.id, level: level, ...levelBuild}, 
                    {
                        items: choices,
                    }
                )
            }
        },
        openSimpleChoiceDialog(member, level, feature) {
            if (!!member && !!level && !!feature) {
                const levelBuild = !!member.build && !!member.build[level] ? member.build[level] : null
                const choiceSet = this.getChoiceSet(feature)
                const choices = this.$rsd.build.getChoices(choiceSet, member, level)

                // console.log('feature', feature, feature.system.category, choiceSet, choices, levelBuild)

                if (!!choices && !!choices[0] && !!choices[0].type) {
                    const type = choices[0].type
                    this.getDialog('simpleChoiceDialog').show(true, 
                        {id: member.id, level: level, ...levelBuild}, 
                        {
                            abc: member.abc,
                            feature: feature, 
                            items: choices, 
                            searchFunction: (item) => {return this.$rsd.build.getSearchFunction(type, item)}, 
                            objectFunction: (item) => {return this.$rsd.build.getObjectFunction(type, item)}
                        }
                    )
                }
            }
        },
    },
    mounted() {
        this.buildTimer = setInterval(() => {
            this.refreshBuildKey++;

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

            if (this.refreshBuildKey == this.maxBuildTimer || !!nullCheck) {
                clearInterval(this.buildTimer);
                
                setTimeout(() => {
                    this.initiated = true;
                }, 500)
            }
        }, 500);
    }
}
</script>

<style lang="less">
.reverse-switch > .v-input > .v-input__control > .v-input__slot {
    flex-direction: row-reverse;
    justify-content: flex-end;

    .v-label {
        flex-grow: 0;
        margin-right: 5px;
    }
}

.party-overview {
    height: calc(~"100vh - 150px");
    overflow-y: scroll;
    overflow-x: clip;
}

.icon-button {
    height: 65px !important;
}

.skeleton-text-fix {
    display:inline-block;
    position: relative;
    top:5px; 
    width:6px;
}
</style>