echo "Starting produciton build..."
rollup -c --environment INCLUDE_DEPS,BUILD:production
echo "Created production build 📦"