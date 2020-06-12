<template>
  <div class="detail-root">
    <nav-bar />
    <div class="page-container container">
      <h1>VALIDATOR INFO</h1>
      <panel>
        <template v-slot:header>
          <span>Detail</span>
        </template>
        <div class="info-con">
         <div class="base-inco">
           <div class="left">
             <img v-if="!icon || true" class="icon" src="../../../assets/node_icon.png">
             <img v-else class="icon" :src="icon">
             <span v-if="active" class="status">active</span>
             <span v-else class="status inactive">inactive</span>
           </div>
           <div class="right">
             <div class="name">
               {{name}}
               <div class="rank">{{rank}}</div>

             </div>
             <div class="detail">
               <div class="column column1">
                 <div class="oneline">
                   <div class="label">Node Id</div>
                   <div class="value">{{nodes[0]}}</div>
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
                 <div class="oneline">
                   <div class="label">Entity ID</div>
                   <div class="value">{{entityId}}</div>
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
          <div class="sep"></div>
          <div class="desc">
            <div class="label">Website</div>
            <div class="value"> <a v-if="website" :href="website">{{website}}</a></div>
          </div>
          <div class="desc">
            <div class="label">Description</div>
            <div class="value">An all-in-one data privacy and management API that integrates directly with your stack</div>
          </div>
          <a :href="editURL" class="edit">
            Update validator info?
          </a>
        </div>
      </panel>
      <div v-if="false" class="list-panels">
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
      <panel class="block-list-wrapper">
        <template v-slot:header>
          <span>Proposels</span>
        </template>
        <block-table root-class="block-total-list" cell-class="block-total-list-cell" :columns="blockListColumns" :data="blockList">
        </block-table>
        <div class="page-navigation">
          <page type="simple" :sizer="blockListSizer" :records-count="totalBlockListSize" :page="blockListPage" root-class="block-page" @goto="goto"></page>
        </div>
      </panel>
    </div>
  </div>
</template>

<script>
  import Panel from '../../../components/Panel'
  import BlockTable from '../../../components/Table/index'
  import Page from '../../../components/Page'
  import NavBar from '../../../components/NavigationBar'
  import TabMenu from '../../../components/TabMenu'
  import BlockInfo from '../../../components/index/BlockInfo'
  import { fetchBlockInfo, fetchBlockList, fetchValidatorDetail, getBlockByProposer } from '../../../fetch'
  import Config from '../../../config'
  export default {
    name: 'validatorDetail',
    components: {
      NavBar,
      BlockTable,
      Panel,
      Page
    },
    async asyncData({ $axios, params }) {
      const entityId = decodeURIComponent(params.id)
      const { name = 'Validator', escrow, proposals, signs, nodes = [''], balance, website = '', icon = '', active } = await fetchValidatorDetail($axios, entityId)
      // const { signs: signsList, proposals: proposalsList } = await fetchBlockList($axios, entityId)
      const { list: blockList, totalSize: totalBlockListSize } = await getBlockByProposer($axios, entityId)
      const res = {
        blockList,
        totalBlockListSize,
        signsList: [],
        proposalsList: [],
        blockInfo: {},
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
      };
      return res
    },
    data() {
      const { rank } = this.$route.query
      return {
        editURL: Config.editURL,
        rank,
        blockListSizer: 5,
        blockListPage: 1,
        blockListColumns: [
          {
            title: 'Height',
            key: 'height'
          },
          {
            title: 'Block Hash',
            key: 'hash'
          },
          {
            title: 'Txs',
            key: 'txs'
          },
          {
            title: 'Times',
            key: 'timestamp'
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
        const $axios = this.$axios
        const { list: blockList, totalSize: totalBlockListSize } = await getBlockByProposer($axios, this.entityId, this.blockListSizer, this.blockListPage)
        this.blockList = blockList
        this.totalBlockListSize = totalBlockListSize
        this.blockListPage = pageNumber
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
    right: rem(20);
    bottom: rem(28);
    font-size: rem(12);
    line-height: rem(17);
    color: #B8B8B8;
    display: flex;
    align-items: center;
  }
  h1{
    font-size: rem(20);
    margin-bottom: rem(20);
    padding-top: rem(20);
    @include regular;;
    font-weight: normal;
    color: #161616;
    line-height: rem(28);
  }
  .detail-root {
    background-color: #f7f7f7;
  }
  .info-con {
    position: relative;
    padding: rem(20);
    padding-bottom: 0;
    border-radius: rem(8);
    .base-inco {
      display: flex;
      flex-direction: row;
    }
    .sep {
      border-top: 1px solid rgba(0,0,0,0.20);
      height: 0;
      margin-top: rem(18);
      margin-bottom: rem(18);
    }
    .desc {
      line-height: rem(20);
      display: flex;
      align-items: center;
      margin-top: rem(8);
      &:first-child{
        margin-top: rem(0);
      }
      .label {
        @include medium;
        font-size: rem(16);
        color: #3E3E3E;
        width: rem(124);
        text-align: left;
      }
      .value {
        color: #5F5F5F;
        @include regular;
        font-size: rem(11);
        a {
          color: #3273DC;
        }
      }
    }
    .name {
      color: #3E3E3E;
      font-size: rem(16);
      line-height: rem(22);
      @include medium;
      display: flex;
      align-items: center;
    }
    .right {
      margin-left: 2.56rem;
      flex: 1;
      overflow: hidden;
      .detail {
        display: flex;
        flex-direction: row;
        margin-top: rem(16);
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
          line-height: rem(20);
          margin-top: rem(8);
          .value {
          }
          &:first-child {
            margin-top: 0;
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
          font-size: rem(14);
          color: #3E3E3E;
          @include medium;
          width: rem(90);
          text-align: left;
        }
        .value {
          font-size: rem(14);
          color: #5F5F5F;
          flex: 1;
          overflow: hidden;
          @include regular;;
        }
      }
    }
    .left {
      width: rem(80);
      position: relative;
    }
    .icon{
      width: rem(80);
      height: rem(80);
      border: 0;
    }
    .status{
      display: block;
      line-height: rem(20);
      width: rem(80);
      font-size: rem(12);
      @include regular;;
      background-color: $theme-color;
      margin: rem(11) auto 0;
      color: white;
      text-align: center;
      border-radius: rem(4);
      &.inactive {
        background-color: #B6B6B6;
      }
    }
    .rank{
      width: rem(22);
      height: rem(22);
      color: white;
      font-size: rem(12);
      display: flex;
      align-content: center;
      justify-content: center;
      background-color: $theme-color;
      border-radius: 50%;
      margin-left: rem(10);
    }
  }
  .list-panels {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: rem(12);
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
    padding-top: rem(16);
    display: flex;
    justify-content: center;
  }
  .block-list-wrapper {
    margin-top: rem(21);
    padding-bottom: rem(15);
    .block-total-list{
      width: calc(100% - 20px);
      margin-left: 10px;
    }
  }
  @media(-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2) {
    .info-con {
      .sep {
        border-width: 0.5px;
      }
    }
  }
</style>
