/**
 * 自定义remark插件，将连续的Markdown图片转换为flex布局
 */
export default function remarkImageGroup() {
  return (tree) => {
    // 查找连续的图片节点
    const visit = (node, index, parent) => {
      if (node.type !== 'paragraph') return;
      
      // 检查段落是否只包含图片
      const onlyImages = node.children && node.children.every(child => 
        child.type === 'image' || (child.type === 'text' && child.value.trim() === '')
      );
      
      if (onlyImages && node.children && node.children.some(child => child.type === 'image')) {
        // 将Markdown图片转换为HTML布局
        const images = node.children
          .filter(child => child.type === 'image')
          .map(img => {
            return {
              type: 'html',
              value: `<img src="${img.url}" alt="${img.alt || ''}" style="max-height: 200px; width: auto;">`
            };
          });
        
        // 创建包装div
        node.type = 'html';
        node.value = `<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 20px 0;">
  ${images.map(img => img.value).join('\n  ')}
</div>`;
        
        delete node.children;
      }
    };
    
    // 遍历语法树
    const visitNodes = (node) => {
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          visit(node.children[i], i, node);
          visitNodes(node.children[i]);
        }
      }
    };
    
    visitNodes(tree);
  };
}