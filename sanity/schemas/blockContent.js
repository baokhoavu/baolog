export default {
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }, { title: 'H1', value: 'h1' }, { title: 'H2', value: 'h2' }],
      lists: [{ title: 'Bullet', value: 'bullet' }],
    },
    { type: 'image', options: { hotspot: true } },
  ],
};
