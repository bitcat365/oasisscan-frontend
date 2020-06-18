<template>
  <div class="detail-root">
    <nav-bar :active="2"/>
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
                   <div class="label">Proposed Blocks</div>
                   <div class="value">{{proposals}}</div>
                 </div>
               </div>
             </div>
           </div>
         </div>
<!--
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
-->
        </div>
      </panel>
      <div v-if="false" class="list-panels">
        <panel class="voters-panel">
          <template v-slot:header>
            <span>Escrow Status</span>
          </template>
        </panel>
        <panel class="voters-panel">
          <template v-slot:header>
            <span>Signatures</span>
          </template>
        </panel>
      </div>
      <div class="list-panels">
        <panel v-if="delegatorsList" class="voters-panel half-table-panel">
          <template v-slot:header>
            <span>Delegators</span>
          </template>
          <p v-if="delegatorsList && delegatorsList.length === 0" class="no-result">
            <img class="empty-icon" src="../../../assets/empty.png">
            No Delegators
          </p>
          <block-table
            v-if="delegatorsList && delegatorsList.length > 0"
            :data="delegatorsList"
            :columns="columns1"
            :expand="false"
            class="block-total-list  delegator-table"
            cell-class="block-total-list-cell"
          />
          <div class="page-navigation">
            <page
              v-if="delegatorsList && delegatorsList.length > 0"
              type="simple"
              :sizer="eventListSizer"
              :records-count="totalDelegatorSize"
              :page="delegatorListPage"
              root-class="block-page"
              @goto="gotoDelegators"></page>
          </div>
        </panel>
        <panel v-if="evensList" class="voters-panel half-table-panel">
          <template v-slot:header>
            <span>Escrow Event</span>
          </template>
          <p v-if="evensList && evensList.length === 0" class="no-result">
            <img class="empty-icon" src="../../../assets/empty.png">
            No Escrow Event
          </p>
          <block-table
            v-if="evensList && evensList.length > 0"
            :data="evensList"
            :columns="columns2"
            :expand="false"
            class="block-total-list events-list"
            cell-class="block-total-list-cell"
          >
            <template v-slot:amountAndShares="slotData">
              <div class="amount-share" :class="positiveStyle(slotData.data)">
                {{showAmountShare(slotData.data)}}
              </div>
            </template>
          </block-table>
          <div v-if="evensList && evensList.length > 0" class="page-navigation">
            <page
              type="simple"
              :sizer="eventListSizer"
              :records-count="totalEventListSize"
              :page="eventListPage"
              root-class="block-page"
              @goto="gotoEvents"/>
          </div>
        </panel>
      </div>
      <panel class="block-list-wrapper">
        <template v-slot:header>
          <span>Proposals</span>
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
  import { getDelegatorsByProposer, getEventsByProposer, fetchValidatorDetail, getBlockByProposer } from '../../../fetch'
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
      const { name = 'Validator', escrow, proposals, signs, nodes = [''], balance, website = '', icon = '', active, rank } = await fetchValidatorDetail($axios, entityId)
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
        rank,
        entityId
      };
      return res
    },
    data() {
      return {
        editURL: Config.editURL,
        blockListSizer: 5,
        eventListSizer: 5,
        blockListPage: 1,
        delegatorListPage: 1,
        eventListPage: 1,
        totalDelegatorSize: 0,
        totalEventListSize: 0,
        delegatorsList: null,
        evensList: null,
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
        columns1: [
          {
            title: 'Entity',
            key: 'entityId'
          },
          {
            title: 'Amount/Shares',
            key: 'amountAndShares'
          },
          {
            title: 'Percentage',
            key: 'percent'
          }
        ],
        columns2: [
          {
            title: 'Height',
            key: 'height'
          },
          {
            title: 'Tx Hash',
            key: 'txHash'
          },
          {
            title: 'Amount/Shares',
            key: 'amountAndShares',
            slot: true
          },
          {
            title: 'Time',
            key: 'timestamp'
          }
        ]
      }
    },
    mounted() {
      this.gotoEvents(1)
      this.gotoDelegators(1)
    },
    methods: {
      async goto(pageNumber) {
        const $axios = this.$axios
        const { list, totalSize } = await getBlockByProposer($axios, this.entityId, this.blockListSizer, pageNumber)
        this.blockList = list
        this.totalBlockListSize = totalSize
        this.blockListPage = pageNumber
      },
      async gotoEvents(pageNumber) {
        const $axios = this.$axios
        const { list, totalSize } = await getEventsByProposer($axios, this.entityId, this.eventListSizer, pageNumber)
        this.evensList = list
        console.log('evensList', list)
        this.totalEventListSize = totalSize
        this.eventListPage = pageNumber
      },
      async gotoDelegators(pageNumber) {
        const $axios = this.$axios
        const { list, totalSize } = await getDelegatorsByProposer($axios, this.entityId, this.eventListSizer, pageNumber)
        this.delegatorsList = list
        console.log('delegatorsList', list)
        this.totalDelegatorSize = totalSize
        this.delegatorListPage = pageNumber
      },
      showAmountShare(amountShare) {
        const f = amountShare.split('/')[0]
        console.log('f', f)
        if (f > 0) {
          return '+' + amountShare
        } else if (f < 0) {
          return '-' + amountShare
        }
        return amountShare
      },
      positiveStyle(amountShare) {
        const f = amountShare.split('/')[0]
        if (f > 0) {
          return 'positive'
        } else if (f < 0) {
          return 'negative'
        }
        return ''
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../assets/css/common";
  /deep/ .events-list {
    thead {
      th:nth-child(1) {
        width:rem(90)
      }
      th:nth-child(4) {
        width:rem(110)
      }
    }
  }
  .amount-share{
    &.positive {
      color: #00B538;
    }
    &.negative {
      color: #B60000;
    }
  }
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
    width: rem(594);
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
  .no-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 14px;
    color: rgba(55, 65, 107, 1);
    padding: rem(80) 0;
    .empty-icon {
      width: rem(80);
      margin-bottom: rem(11);
    }
  }
  .half-table-panel {
    display: flex;
    flex-direction: column;
    /deep/ .panel-content{
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      min-height: rem(272);
    }
  }
  /deep/ .delegator-table {
    thead tr{
      th:nth-child(1){
        width: rem(250);
      }
      th:nth-child(3){
        width: rem(100);
      }
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
