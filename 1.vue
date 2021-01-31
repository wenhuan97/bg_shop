<template>
  <el-table border :data="goodsCates" stripe style="width: 100%">
    <el-table-column type="index"></el-table-column>
    <el-table-column prop="name" label="分类名称"></el-table-column>
    <el-table-column label="是否有效">
      <template slot-scope="scope">
        <i
          v-if="scope.row.cat_deleted"
          style="color: lightgreen"
          class="el-icon-success"
        ></i>
        <i v-else style="color: red" class="el-icon-error"></i>
      </template>
    </el-table-column>
    <el-table-column label="排序">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
        <el-tag v-else-if="scope.row.cat_level == 1" type="success"
          >二级</el-tag
        >
        <el-tag v-else type="danger">三级</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-tooltip :enterable="false" content="编辑商品分类" placement="top">
          <el-button
            @click="showEditGoodsCate(scope)"
            circle
            type="primary"
            icon="el-icon-edit"
          ></el-button>
        </el-tooltip>
        <el-tooltip :enterable="false" content="删除商品分类" placement="top">
          <el-button
            @click="deleteGoodsCate(scope.row)"
            circle
            type="danger"
            icon="el-icon-delete"
          ></el-button>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>
