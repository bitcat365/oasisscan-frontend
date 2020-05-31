<template>
  <div>
    <nav-bar />
    <tab-menu :active="2"></tab-menu>
    <div class="page-container container">
      <block-info :blockInfo="blockInfo"></block-info>
      <h1>VALIDATOR INFO</h1>
      <panel>
        <template v-slot:header>
          <span>Detail</span>
          <a :href="editURL" class="edit">
            Edit
          </a>
        </template>
        <div class="info-con">
          <div class="left">
            <img v-if="!icon" class="icon" src="../../../assets/node_icon.png">
            <img v-else class="icon" :src="icon">
            <span v-if="active" class="status">active</span>
            <span v-else class="status inactive">inactive</span>
            <div class="rank">{{rank}}</div>
          </div>
          <div class="right">
            <div class="name">
              {{name}} <a v-if="website" :href="website">
              <img class="link" src="../../../assets/link.png"/>
            </a>
            </div>
           <div class="detail">
             <div class="column column1">
               <div class="twoline">
                 <div class="label">Entity ID</div>
                 <div class="value">{{entityId}}</div>
               </div>
               <div class="oneline">
                 <div class="label">Escrow</div>
                 <div class="value">{{escrow}}</div>
               </div>
               <div class="oneline">
                 <div class="label">Balance</div>
                 <div class="value">{{balance}}</div>
               </div>
             </div>
             <div class="column column2">
               <div class="twoline">
                 <div class="label">Node</div>
                 <div class="value">{{nodes[0]}}</div>
               </div>
               <div class="oneline">
                 <div class="label">Signatures</div>
                 <div class="value">{{signs}}</div>
               </div>
               <div class="oneline">
                 <div class="label">Proposer</div>
                 <div class="value">{{proposals}}</div>
               </div>
             </div>
           </div>
          </div>
        </div>
      </panel>
      <div class="list-panels">
        <panel root-class="voters-panel">
          <template v-slot:header>
            <span>Signatures</span>
          </template>
          <block-table
            :data="signsList"
            :columns="columns"
            :expand="false"
            root-class="block-total-list"
            cell-class="block-total-list-cell"
          />
        </panel>
        <panel root-class="voters-panel">
          <template v-slot:header>
            <span>Proposals</span>
          </template>
          <block-table
            :data="proposalsList"
            :columns="columns2"
            :expand="false"
            root-class="block-total-list"
            cell-class="block-total-list-cell"
          />
        </panel>
      </div>
    </div>
  </div>
</template>

<script>
  import Panel from '../../../components/Panel'
  import BlockTable from '../../../components/Table/index'

  import NavBar from '../../../components/NavigationBar'
  import TabMenu from '../../../components/TabMenu'
  import BlockInfo from '../../../components/index/BlockInfo'
  import { fetchBlockInfo, fetchBlockList, fetchValidatorDetail } from '../../../fetch'
  import Config from '../../../config'
  export default {
    name: 'validatorDetail',
    components: {
      NavBar,
      BlockTable,
      Panel,
      TabMenu,
      BlockInfo
    },
    async asyncData({ $axios, params }) {
      const entityId = decodeURIComponent(params.id)
      const { name = 'Validator', escrow, proposals, signs, nodes = [''], balance, website = '', icon = '', active } = await fetchValidatorDetail($axios, entityId)
      const { signs: signsList, proposals: proposalsList } = await fetchBlockList($axios, entityId)
      const blockInfo = await fetchBlockInfo($axios)
      const res = {
        signsList,
        proposalsList,
        blockInfo,
        name,
        escrow,
        proposals,
        signs,
        nodes,
        balance,
        website,
        icon,
        active,
        entityId
      }
      return res
    },
    data() {
      const { rank } = this.$route.query
      return {
        editURL: Config.editURL,
        rank,
        listSchema: [
          {
            label: 'rank',
            key: 'rank'
          },
          {
            label: 'name',
            key: 'name'
          },
          {
            label: 'website',
            key: 'website'
          },
          {
            label: 'votesTotal',
            key: 'votesTotal'
          },
          {
            label: 'stashAddress',
            key: 'stashAddress'
          },
          {
            label: 'sessionAddress',
            key: 'sessionAddress'
          },
          {
            label: 'mortgageTotal',
            key: 'mortgageTotal'
          },
          {
            label: 'mindCount',
            key: 'mindCount'
          },
          {
            label: 'missCount',
            key: 'missCount'
          }
        ],
        list: [],
        columns: [
          {
            title: 'Block',
            key: 'blocks'
          },
          {
            title: 'Signs',
            key: 'count'
          },
          {
            title: 'Score',
            key: 'score'
          }
        ],
        columns2: [
          {
            title: 'Block',
            key: 'blocks'
          },
          {
            title: 'Proposer',
            key: 'count'
          },
          {
            title: 'Score',
            key: 'score'
          }
        ]
      }
    },
    methods: {
      async goto(pageNumber) {

      },
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/common";

  .container {
    padding-bottom: 2rem;
  }
  .edit {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    font-size: 0.94rem;
    color: #727272;
    padding:0 1.44rem;
    display: flex;
    align-items: center;
  }
  h1{
    font-size: 1.5rem;
    margin-top: 1.75rem;
    margin-bottom: 2.06rem;
    padding: 0;
    @include regular;;
    font-weight: normal;
    color: black;
    line-height: 2.06rem;
  }
  .info-con {
    padding: 2.56rem 2.75rem;
    padding-right: 0;
    border: 1px solid #979797;
    border-radius: 1px;
    border-top: 0;
    display: flex;
    flex-direction: row;
    .name {
      color: #434343;
      font-size: 1.13rem;
      @include regular;;
      display: flex;
      align-items: center;
      .link {
        width: 1.44rem;
        height: 1.44rem;
        margin-left: 0.44rem;
        position: relative;
        top: 0.2rem;
      }
    }
    .right {
      margin-left: 2.56rem;
      flex: 1;
      overflow: hidden;
      .detail {
        display: flex;
        flex-direction: row;
      }
      .column {
        overflow: hidden;
        padding-right: 2rem;
        flex: 1;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        .oneline {
          display: flex;
          flex-direction: row;
          .value {
          }
        }
        .twoline {
          .value {
            font-size: 0.8rem;
            overflow:hidden; //超出的文本隐藏
            text-overflow:ellipsis; //溢出用省略号显示
            white-space:nowrap; //溢出不换行
          }
        }
        .label {
          font-size: 1rem;
          color: #7A7A7A;
          @include bold;
          width: 6rem;
        }
        .value {
          font-size: 1rem;
          color: #7A7A7A;
          @include regular;;
        }
      }
    }
    .left {
      width: 5.56rem;
      position: relative;
    }
    .icon{
      width: 5.56rem;
      height: 5.56rem;
      border: 0;
    }
    .status{
      line-height: 1.75rem;
      font-size: 1.25rem;
      @include regular;;
      background-color: $theme-color;
      margin-top: 1.06rem;
      padding: 0 .75rem;
      color: white;
      &.inactive {
        background-color: #B6B6B6;;
      }
    }
    .rank{
      position: absolute;
      right: -1.5rem;
      top: -1.5rem;
      width: 2.5rem;
      height: 2.5rem;
      background-image: url("../../../assets/rank.png");
      background-size: 100%;
      color: white;
      font-size: 1.25rem;
      display: flex;
      align-content: center;
      justify-content: center;
      padding-top: 0.2rem;
    }
  }
  .list-panels {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .voters-panel {
    width: 30.13rem;
    margin-top: 1.44rem;
    border: 1px solid #D8D8D8;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
    .block-total-list {
      width: 100%;
      margin-left: 0;
    }
  }
  .page-navigation {
    padding-top: 30px;
    display: flex;
    justify-content: flex-end;
  }
</style>
