<template>
  <div class="info-con">
    <a :href="editURL" target="_blank"><span class="edit">Update validator info?</span></a>
    <div class="info-con-top">
      <div class="left">
        <img v-if="!icon" class="icon" src="~/assets/validator_dafult_icon.svg" />
        <img v-else class="icon" :src="icon" />
        <div v-if="active" class="status">Active</div>
        <div v-else class="status inactive">Inactive</div>
      </div>
      <div class="right">
        <Row class="right-top">
          <Col span="22" class="right-top-left">
            <div class="name">
              <span v-if="name"> {{ name }}</span>
              <span v-else> {{ entityAddress }}</span>
            </div>
            <div class="rank">{{ rank }}</div>
            <a v-if="website" target="_blank" :href="website" title="website"><SvgIcon className="svg" iconName="validator_website"></SvgIcon></a>
            <a v-if="email" target="_blank" :href="`mailto:${email}`" title="email"><SvgIcon className="svg" iconName="validator_email"></SvgIcon></a>
            <a v-if="twitter" target="_blank" :href="`https://twitter.com/${twitter}`" title="twitter"><SvgIcon className="svg" iconName="validator_twitter"></SvgIcon></a>
            <a v-if="keybase" target="_blank" :href="`https://keybase.io/${keybase}`" title="keybase"><SvgIcon className="svg" iconName="validator_keybase"></SvgIcon></a>
          </Col>
          <Col span="2">
            <div v-if="status" class="status">
              <div></div>
              <span>Online</span>
            </div>
            <div v-else class="status inactive">
              <div></div>
              <span>Offline</span>
            </div>
          </Col>
        </Row>
        <Row class=" right-bottom">
          <Col span="12">
            <div class="address">
              <div class="label">Address</div>
              <div class="value">
                <a :href="`/accounts/detail/${entityAddress}`">{{ entityAddress ? entityAddress : '' }}</a>
              </div>
            </div>
          </Col>
          <Col span="12">
            <div class="EntityID">
              <div class="label">Entity ID</div>
              <div class="value">{{ entityId ? entityId : '' }}</div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <Description :list="descriptionList" class="info-con-bot">
      <div slot="escrow">
        <span>{{ escrow | readable }} ROSE({{ escrowPercent | percentFormat }}) </span>&nbsp;
        <span :class="escrowChange24 > 0 ? 'success' : escrowChange24 < 0 ? 'error' : ''">{{ showChangeSign(escrowChange24) }}{{ escrowChange24 | readable }}(24h)</span>
      </div>
      <div slot="bounds">
        {{ boundDesc }}
        <Icon type="ios-information-circle-outline" class="icon bounds" v-if="bound" :data-attr="boundDesc + (bound ? ' [start at epoch ' + bound.start + ']' : '')" />
      </div>
      <div slot="rates">
        {{ commission | percentFormat }}
        <Icon type="ios-information-circle-outline" class="icon rates" v-if="commissionDesc" :data-attr="commissionDesc" />
      </div>
      <div slot="runtimes">
        <ColourDiv v-for="item in runtimes" :key="item.id" :color="item.online ? 'success' : 'error'" :data-attr="'Node ID:'+item.nodeId">
          <span style="cursor: pointer" v-clipboard:copy="item.nodeId" v-clipboard:success="onCopy">{{ item.name }}</span>
        </ColourDiv>
      </div>
    </Description>
  </div>
</template>

<script>
import { readable, percent } from '~/utils/index'
import Config from '~/config'
import Description from '~/components/description/index.vue'
import ColourDiv from '~/components/colourDiv/colourDiv'
export default {
  components: { Description, ColourDiv },
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    descriptionList() {
      const list = [
        { title: 'Node ID', content: this.detailData.nodeId || '' },
        { title: 'Escrow', name: 'escrow' },
        { title: 'Delegators', content: readable(this.detailData.delegators) },
        { title: 'Commission Bounds', name: 'bounds' },
        { title: 'Commission Rates', name: 'rates' },
        { title: 'Paratimes', name: 'runtimes' }
      ]
      return list
    },
    commissionDesc() {
      return this.rates[0] ? percent(this.rates[0].rate, 1) + ' [start at epoch ' + this.rates[0].start + ']' : false
    }
  },
  data() {
    return {
      name: this.detailData.name ? this.detailData.name : this.detailData.entityAddress || 'Validator',
      escrow: this.detailData.escrow,
      escrowPercent: this.detailData.escrowPercent,
      escrowChange24: this.detailData.escrowChange24,
      proposals: this.detailData.proposals,
      signs: this.detailData.signs,
      nodes: this.detailData.nodes || [''],
      balance: this.detailData.balance,
      website: this.detailData.website || '',
      email: this.detailData.email || '',
      twitter: this.detailData.twitter || '',
      keybase: this.detailData.keybase || '',
      icon: this.detailData.icon || '',
      active: this.detailData.active,
      status: this.detailData.status,
      rank: this.detailData.rank,
      entityAddress: this.detailData.entityAddress,
      rates: this.detailData.rates,
      nonce: this.detailData.nonce,
      commission: this.detailData.commission,
      bounds: this.detailData.bounds,
      bound: this.detailData.bounds[0],
      boundDesc: this.detailData.bounds && this.detailData.bounds[0] ? this.detailData.bounds[0].min * 100 + '%' + '~' + this.detailData.bounds[0].max * 100 + '%' : 'No Schedule',
      entityId: this.detailData.entityId,
      runtimes: this.detailData.runtimes,
      editURL: Config.editURL
    }
  },
  methods: {
    showChangeSign(value) {
      if (value > 0) {
        return '+'
      } else if (value < 0) {
        //        return '-' + value
        return ''
      }
      return ''
    },
    onCopy() {
      this.$toast.top('Node ID Copied')
    },
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/css/utils';
.info-con {
  padding: 0 rem(10);
  position: relative;
  .success {
    color: $success500;
  }
  .error {
    color: $error500;
  }
  .edit {
    z-index: 9;
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: rem(12);
    color: $gray300;
  }
  .info-con-top {
    height: rem(85);
    margin-bottom: rem(20);
    display: flex;
    gap: rem(20);
    .left {
      .icon {
        width: rem(60);
        height: rem(60);
        border: 0;
        border-radius: rem(30);
      }
      .status {
        height: rem(18);
        line-height: rem(18);
        width: rem(60);
        font-size: rem(12);
        background-color: $success500;
        color: white;
        text-align: center;
        border-radius: rem(8);
        &.inactive {
          background-color: $error500;
        }
      }
    }
    .right {
      flex-grow: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .right-top {
        .right-top-left {
          display: flex;
          align-items: center;
          .name {
            font-size: rem(18);
          }
          .rank {
            margin-left: rem(10);
            color: white;
            background-color: $theme-color;
            border-radius: 50%;
            width: rem(24);
            height: rem(24);
            line-height: rem(24);
            font-size: rem(12);
            text-align: center;
          }
          a {
            margin-left: rem(10);
            display: flex;
            justify-content: flex-end;
            .svg {
              width: rem(24);
              height: rem(24);
              color: $gray300;
            }
            .svg:hover {
              color: $gray400;
            }
          }
          .extra-icon {
            width: rem(20);
          }
        }
        .status {
          color: $success500;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          gap: rem(8);
          align-items: center;
          > div {
            width: rem(16);
            height: rem(16);
            line-height: rem(16);
            border-radius: 50%;
            background-color: $success500;
          }
          &.inactive {
            color: $error500;
            > div {
              color: #fff;
              background-color: $error500;
            }
          }
        }
      }
      .right-bottom {
        .value {
          color: $gray500;
          a {
            color: $blue500;
          }
        }
      }
    }
  }
  .info-con-bot {
    border-top: 1px solid $gray100;
    .icon {
      cursor: pointer;
      font-size: rem(18);
      margin-left: rem(2);
      vertical-align: -2px;
      position: relative;
    }
    .icon:hover::after {
      position: absolute;
      top: -1.5rem;
      left: -4rem;
      font-family: 'Inter';
      @extend .hoverText;
    }
    .bounds:hover::after {
      content: attr(data-attr);
    }
    .rates:hover::after {
      content: attr(data-attr);
    }
    /deep/.colourDiv:hover::after {
      content: attr(data-attr);
      position: absolute;
      top: -1.5rem;
      font-family: 'Inter';
      @extend .hoverText;
    }
  }
}
</style>
