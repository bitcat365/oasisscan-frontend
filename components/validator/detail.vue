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
        <Row class="right-bottom">
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
      <div slot="bounds">
        {{ bound ? bound.min * 100 + '%' + '~' + bound.max * 100 + '%' : 'No Schedule' }}
        <Icon type="ios-information-circle-outline" class="icon bounds" />
      </div>
      <div slot="rates">
        {{ commission | percentFormat }}
        <Icon type="ios-information-circle-outline" class="icon rates" />
      </div>
    </Description>
  </div>
</template>

<script>
import { readable } from '~/utils/index'
import Config from '~/config'
import Description from '~/components/description/index.vue'
export default {
  components: { Description },
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
        { title: 'Escrow', content: readable(this.detailData.escrow) + ' ROSE' || '0 ROSE' },
        { title: 'Delegators', content: readable(this.detailData.delegators) },
        { title: 'Commission Bounds', name: 'bounds' },
        { title: 'Commission Rates', name: 'rates' }
        // { title: 'Paratimes', content: '?' }
      ]
      return list
    }
  },
  data() {
    return {
      name: this.detailData.name ? this.detailData.name : this.detailData.entityAddress || 'Validator',
      // escrow: this.detailData.escrow,
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
      // delegators: this.detailData.delegators,
      rates: this.detailData.rates,
      bounds: this.detailData.bounds,
      nonce: this.detailData.nonce,
      commission: this.detailData.commission,
      bound: this.detailData.bound,
      entityId: this.detailData.entityId,
      // nodeId: this.detailData.nodeId,
      editURL: Config.editURL
    }
  }
}
</script>

<style scoped lang="scss">
@import '~@/assets/css/utils';
.info-con {
  padding: 0 rem(10);
  position: relative;
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
      content: '1%~25% [start at epoch 14973]';
    }
    .rates:hover::after {
      content: '1% [start at epoch 14973]';
    }
  }
}
</style>
